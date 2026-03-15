import { Command } from "commander";
import chalk from "chalk";
import Table from "cli-table3";
import { writeFileSync, readFileSync, unlinkSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { execSync } from "child_process";
import { apiGet, apiPost, apiPatch } from "../api.js";
import { generateBlogPost } from "../lib/ai.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string | null): string {
  if (!iso) return chalk.dim("—");
  const d = new Date(iso);
  return d.toLocaleDateString("ca-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function statusBadge(published: boolean): string {
  return published
    ? chalk.green("Publicat")
    : chalk.yellow("Esborrany");
}

async function fetchPostBySlug(slug: string): Promise<any> {
  const res = await apiGet(`/api/blog/${slug}`);
  if (!res.ok) {
    if (res.status === 404) {
      console.error(chalk.red(`\n  Post not found: ${slug}\n`));
    } else {
      console.error(chalk.red(`\n  Error fetching post: ${res.status}\n`));
    }
    process.exit(1);
  }
  return res.json();
}

// ---------------------------------------------------------------------------
// blog list
// ---------------------------------------------------------------------------

async function listAction(opts: { draft?: boolean }): Promise<void> {
  const params = new URLSearchParams();
  params.set("page", "1");
  params.set("limit", "50");
  if (opts.draft) params.set("published", "false");

  const res = await apiGet(`/api/blog?${params.toString()}`);
  if (!res.ok) {
    console.error(chalk.red(`Error fetching blog posts: ${res.status}`));
    process.exit(1);
  }

  const json = (await res.json()) as {
    data: any[];
    total: number;
    page: number;
    totalPages: number;
  };

  if (json.data.length === 0) {
    console.log(chalk.dim("\n  No blog posts found.\n"));
    return;
  }

  const table = new Table({
    head: ["Slug", "Titol", "Categoria", "Estat", "Data"],
    style: { head: ["cyan"] },
    colWidths: [30, 40, 14, 14, 14],
    wordWrap: true,
  });

  for (const post of json.data) {
    table.push([
      post.slug ?? "",
      post.tituloCa ?? post.tituloEs ?? "",
      post.categoria ?? "",
      statusBadge(!!post.published),
      formatDate(post.publishedAt ?? post.createdAt ?? null),
    ]);
  }

  console.log();
  console.log(table.toString());
  console.log(
    chalk.dim(
      `  Showing ${json.data.length} of ${json.total} posts (page ${json.page}/${json.totalPages})`
    )
  );
  console.log();
}

// ---------------------------------------------------------------------------
// blog generate
// ---------------------------------------------------------------------------

async function generateAction(topic: string): Promise<void> {
  console.log(
    chalk.cyan(`\n  Generating blog post about: "${topic}"...`)
  );
  console.log(chalk.dim("  This may take 30-60 seconds.\n"));

  let draft;
  try {
    draft = await generateBlogPost(topic);
  } catch (err: any) {
    console.error(chalk.red(`  AI generation failed: ${err.message}\n`));
    process.exit(1);
  }

  // Save as unpublished draft via API
  const res = await apiPost("/api/blog", {
    ...draft,
    autor: "ARA FINESTRA",
    published: false,
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(
      chalk.red(`  Error saving draft: ${res.status} ${body}\n`)
    );
    process.exit(1);
  }

  console.log(chalk.green("  Draft created successfully!\n"));
  console.log(`  ${chalk.bold("Slug:")}       ${draft.slug}`);
  console.log(`  ${chalk.bold("Titol (CA):")} ${draft.tituloCa}`);
  console.log(`  ${chalk.bold("Titol (ES):")} ${draft.tituloEs}`);
  console.log(`  ${chalk.bold("Titol (EN):")} ${draft.tituloEn}`);
  console.log(`  ${chalk.bold("Categoria:")}  ${draft.categoria}`);
  console.log(`  ${chalk.bold("Languages:")}  CA, ES, EN`);
  console.log(
    chalk.dim(
      `\n  Preview: npm run cli -- blog preview ${draft.slug}`
    )
  );
  console.log(
    chalk.dim(
      `  Publish: npm run cli -- blog publish ${draft.slug}\n`
    )
  );
}

// ---------------------------------------------------------------------------
// blog preview
// ---------------------------------------------------------------------------

async function previewAction(slug: string): Promise<void> {
  const post = await fetchPostBySlug(slug);

  console.log();
  console.log(chalk.bold.cyan(`  ${post.tituloCa ?? post.tituloEs}`));
  console.log(chalk.dim(`  /${"─".repeat(60)}`));
  console.log();
  console.log(`  ${chalk.bold("Slug:")}       ${post.slug}`);
  console.log(`  ${chalk.bold("Categoria:")}  ${post.categoria ?? "—"}`);
  console.log(`  ${chalk.bold("Autor:")}      ${post.autor ?? "—"}`);
  console.log(`  ${chalk.bold("Estat:")}      ${statusBadge(!!post.published)}`);
  console.log(
    `  ${chalk.bold("Publicat:")}   ${formatDate(post.publishedAt ?? null)}`
  );
  console.log();

  // Meta info
  console.log(chalk.bold("  Meta (CA):"));
  console.log(`    Title: ${post.metaTitleCa ?? "—"}`);
  console.log(`    Desc:  ${post.metaDescriptionCa ?? "—"}`);
  console.log();

  // Excerpt
  if (post.extractoCa) {
    console.log(chalk.bold("  Extracte (CA):"));
    console.log(`    ${post.extractoCa}`);
    console.log();
  }

  // Content (strip HTML for terminal display)
  if (post.contenidoCa) {
    console.log(chalk.bold("  Contingut (CA):"));
    console.log(chalk.dim(`  ${"─".repeat(60)}`));
    const plainText = post.contenidoCa
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/?(p|div|h[1-6]|ul|ol|li|blockquote)[\s>][^>]*>/gi, "\n")
      .replace(/<\/?[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    for (const line of plainText.split("\n")) {
      console.log(`  ${line}`);
    }
    console.log();
  }
}

// ---------------------------------------------------------------------------
// blog publish
// ---------------------------------------------------------------------------

async function publishAction(slug: string): Promise<void> {
  const post = await fetchPostBySlug(slug);

  if (post.published) {
    console.log(chalk.yellow(`\n  Post "${slug}" is already published.\n`));
    return;
  }

  const res = await apiPatch(`/api/blog/${post.id}`, {
    published: true,
    publishedAt: new Date().toISOString(),
  });

  if (!res.ok) {
    console.error(chalk.red(`\n  Error publishing post: ${res.status}\n`));
    process.exit(1);
  }

  console.log(
    chalk.green(
      `\n  Post "${slug}" published successfully!\n`
    )
  );
}

// ---------------------------------------------------------------------------
// blog unpublish
// ---------------------------------------------------------------------------

async function unpublishAction(slug: string): Promise<void> {
  const post = await fetchPostBySlug(slug);

  if (!post.published) {
    console.log(
      chalk.yellow(`\n  Post "${slug}" is already unpublished.\n`)
    );
    return;
  }

  const res = await apiPatch(`/api/blog/${post.id}`, {
    published: false,
  });

  if (!res.ok) {
    console.error(chalk.red(`\n  Error unpublishing post: ${res.status}\n`));
    process.exit(1);
  }

  console.log(
    chalk.green(`\n  Post "${slug}" unpublished (set to draft).\n`)
  );
}

// ---------------------------------------------------------------------------
// blog edit
// ---------------------------------------------------------------------------

async function editAction(slug: string): Promise<void> {
  const editor = process.env.EDITOR || process.env.VISUAL || "vi";
  const post = await fetchPostBySlug(slug);

  // Build editable content as JSON
  const editable = {
    tituloCa: post.tituloCa ?? "",
    tituloEs: post.tituloEs ?? "",
    tituloEn: post.tituloEn ?? "",
    contenidoCa: post.contenidoCa ?? "",
    contenidoEs: post.contenidoEs ?? "",
    contenidoEn: post.contenidoEn ?? "",
    extractoCa: post.extractoCa ?? "",
    extractoEs: post.extractoEs ?? "",
    extractoEn: post.extractoEn ?? "",
    metaTitleCa: post.metaTitleCa ?? "",
    metaTitleEs: post.metaTitleEs ?? "",
    metaTitleEn: post.metaTitleEn ?? "",
    metaDescriptionCa: post.metaDescriptionCa ?? "",
    metaDescriptionEs: post.metaDescriptionEs ?? "",
    metaDescriptionEn: post.metaDescriptionEn ?? "",
    categoria: post.categoria ?? "",
  };

  const tmpFile = join(tmpdir(), `arafinestra-blog-${slug}.json`);
  writeFileSync(tmpFile, JSON.stringify(editable, null, 2), "utf-8");

  console.log(chalk.cyan(`\n  Opening ${editor} to edit "${slug}"...\n`));

  try {
    execSync(`${editor} "${tmpFile}"`, { stdio: "inherit" });
  } catch {
    console.error(chalk.red(`\n  Editor exited with error.\n`));
    try { unlinkSync(tmpFile); } catch {}
    process.exit(1);
  }

  // Read back edited content
  let updated: Record<string, string>;
  try {
    const raw = readFileSync(tmpFile, "utf-8");
    updated = JSON.parse(raw);
  } catch (err: any) {
    console.error(
      chalk.red(`\n  Error parsing edited file: ${err.message}\n`)
    );
    console.log(chalk.dim(`  File kept at: ${tmpFile}\n`));
    process.exit(1);
  }

  // Clean up tmp file
  try { unlinkSync(tmpFile); } catch {}

  // PATCH the post
  const res = await apiPatch(`/api/blog/${post.id}`, updated);
  if (!res.ok) {
    console.error(chalk.red(`\n  Error saving post: ${res.status}\n`));
    process.exit(1);
  }

  console.log(chalk.green(`\n  Post "${slug}" updated successfully!\n`));
}

// ---------------------------------------------------------------------------
// Register command
// ---------------------------------------------------------------------------

export function registerBlogCommand(program: Command): void {
  const blog = program
    .command("blog")
    .description("Manage blog posts with AI content generation");

  blog
    .command("list")
    .description("List blog posts in a table")
    .option("--draft", "Show only unpublished drafts")
    .action(listAction);

  blog
    .command("generate <topic>")
    .description("Generate a blog post draft with Claude AI")
    .action(generateAction);

  blog
    .command("preview <slug>")
    .description("Preview a blog post in the terminal")
    .action(previewAction);

  blog
    .command("publish <slug>")
    .description("Publish a blog post (set published=true)")
    .action(publishAction);

  blog
    .command("unpublish <slug>")
    .description("Unpublish a blog post (revert to draft)")
    .action(unpublishAction);

  blog
    .command("edit <slug>")
    .description("Edit a blog post in your $EDITOR")
    .action(editAction);
}
