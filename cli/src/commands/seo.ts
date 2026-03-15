import { Command } from "commander";
import chalk from "chalk";
import Table from "cli-table3";
import { loadConfig } from "../config.js";
import { execSync } from "child_process";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getBaseUrl(): string {
  const config = loadConfig();
  return config.apiUrl.replace(/\/$/, "");
}

const STATIC_PATHS = [
  "",
  "cortizo",
  "subvencions",
  "pressupost",
  "projectes",
  "blog",
  "opinions",
  "contacte",
  "zones",
  "proces",
  "serveis/finestres-pvc",
  "serveis/portes-corredisses",
  "serveis/persianes",
  "serveis/mosquiteres",
  "qui-som",
  "visita-gratuita",
  "financament",
  "legal/privacitat",
  "legal/termes",
  "legal/cookies",
  "legal/avis-legal",
];

async function fetchHtml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "AraFinestraCLI/1.0" },
      redirect: "follow",
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

interface PageCheck {
  path: string;
  url: string;
  hasTitle: boolean;
  hasMetaDesc: boolean;
  hasH1: boolean;
  hasCanonical: boolean;
  hasSchema: boolean;
  score: number;
  error: boolean;
}

function checkHtml(html: string): Omit<PageCheck, "path" | "url" | "error"> {
  const hasTitle = /<title>[^<]+<\/title>/i.test(html);
  const hasMetaDesc =
    /<meta\s[^>]*name=["']description["'][^>]*content=["'][^"']+["'][^>]*\/?>/i.test(
      html
    ) ||
    /<meta\s[^>]*content=["'][^"']+["'][^>]*name=["']description["'][^>]*\/?>/i.test(
      html
    );
  const hasH1 = /<h1[\s>]/i.test(html);
  const hasCanonical = /<link\s[^>]*rel=["']canonical["'][^>]*\/?>/i.test(html);
  const hasSchema =
    /<script\s[^>]*type=["']application\/ld\+json["'][^>]*>/i.test(html);

  const score =
    (hasTitle ? 1 : 0) +
    (hasMetaDesc ? 1 : 0) +
    (hasH1 ? 1 : 0) +
    (hasCanonical ? 1 : 0) +
    (hasSchema ? 1 : 0);

  return { hasTitle, hasMetaDesc, hasH1, hasCanonical, hasSchema, score };
}

function scoreColor(score: number, max: number): string {
  const pct = score / max;
  if (pct >= 0.8) return chalk.green(String(score));
  if (pct >= 0.5) return chalk.yellow(String(score));
  return chalk.red(String(score));
}

function yn(val: boolean): string {
  return val ? chalk.green("YES") : chalk.red("NO");
}

// ---------------------------------------------------------------------------
// seo audit
// ---------------------------------------------------------------------------

async function auditAction(opts: { lang: string }): Promise<void> {
  const base = getBaseUrl();
  const lang = opts.lang;

  console.log(
    chalk.bold(`\nSEO Audit — ${base}/${lang}/  (${STATIC_PATHS.length} pages)\n`)
  );

  const results: PageCheck[] = [];
  const concurrency = 5;

  // Process in batches
  for (let i = 0; i < STATIC_PATHS.length; i += concurrency) {
    const batch = STATIC_PATHS.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(async (p) => {
        const url = `${base}/${lang}/${p}`.replace(/\/$/, "") || `${base}/${lang}`;
        const fullUrl = p === "" ? `${base}/${lang}` : `${base}/${lang}/${p}`;
        process.stdout.write(chalk.gray(`.`));

        const html = await fetchHtml(fullUrl);
        if (!html) {
          return {
            path: `/${lang}/${p}` || `/${lang}`,
            url: fullUrl,
            hasTitle: false,
            hasMetaDesc: false,
            hasH1: false,
            hasCanonical: false,
            hasSchema: false,
            score: 0,
            error: true,
          } as PageCheck;
        }

        const checks = checkHtml(html);
        return {
          path: p === "" ? `/${lang}` : `/${lang}/${p}`,
          url: fullUrl,
          ...checks,
          error: false,
        } as PageCheck;
      })
    );
    results.push(...batchResults);
  }

  console.log("\n");

  // Per-page table
  const table = new Table({
    head: ["Page", "Title", "Meta Desc", "H1", "Canonical", "Schema", "Score"],
    style: { head: ["cyan"] },
  });

  for (const r of results) {
    if (r.error) {
      table.push([
        chalk.red(r.path),
        chalk.red("ERR"),
        chalk.red("ERR"),
        chalk.red("ERR"),
        chalk.red("ERR"),
        chalk.red("ERR"),
        chalk.red("0/5"),
      ]);
    } else {
      table.push([
        r.path,
        yn(r.hasTitle),
        yn(r.hasMetaDesc),
        yn(r.hasH1),
        yn(r.hasCanonical),
        yn(r.hasSchema),
        `${scoreColor(r.score, 5)}/5`,
      ]);
    }
  }

  console.log(table.toString());

  // Summary
  const total = results.length;
  const ok = results.filter((r) => !r.error);
  const counts = {
    title: ok.filter((r) => r.hasTitle).length,
    metaDesc: ok.filter((r) => r.hasMetaDesc).length,
    h1: ok.filter((r) => r.hasH1).length,
    canonical: ok.filter((r) => r.hasCanonical).length,
    schema: ok.filter((r) => r.hasSchema).length,
  };
  const errors = results.filter((r) => r.error).length;
  const totalChecks = ok.length * 5;
  const passedChecks = ok.reduce((s, r) => s + r.score, 0);
  const overall = totalChecks > 0 ? (passedChecks / totalChecks) * 10 : 0;

  console.log(chalk.bold("\nSummary"));
  console.log(`  Pages scanned:  ${total} (${errors} errors)`);
  console.log(`  Title:          ${counts.title}/${ok.length}`);
  console.log(`  Meta Desc:      ${counts.metaDesc}/${ok.length}`);
  console.log(`  H1:             ${counts.h1}/${ok.length}`);
  console.log(`  Canonical:      ${counts.canonical}/${ok.length}`);
  console.log(`  Schema (LD+JSON): ${counts.schema}/${ok.length}`);
  console.log(
    `  Overall score:  ${scoreColor(Math.round(overall * 10) / 10, 10)}/10\n`
  );
}

// ---------------------------------------------------------------------------
// seo broken-links
// ---------------------------------------------------------------------------

async function brokenLinksAction(opts: { lang: string }): Promise<void> {
  const base = getBaseUrl();
  const lang = opts.lang;

  console.log(
    chalk.bold(
      `\nBroken Links Check — ${base}/${lang}/  (${STATIC_PATHS.length} pages)\n`
    )
  );

  // Step 1: Crawl pages, collect unique links
  const allLinks = new Map<string, Set<string>>(); // href → set of source pages

  for (let i = 0; i < STATIC_PATHS.length; i += 5) {
    const batch = STATIC_PATHS.slice(i, i + 5);
    await Promise.all(
      batch.map(async (p) => {
        const fullUrl = p === "" ? `${base}/${lang}` : `${base}/${lang}/${p}`;
        const pagePath = p === "" ? `/${lang}` : `/${lang}/${p}`;
        process.stdout.write(chalk.gray("."));

        const html = await fetchHtml(fullUrl);
        if (!html) return;

        // Extract hrefs
        const hrefRe = /href=["']([^"'#]+)/gi;
        let match: RegExpExecArray | null;
        while ((match = hrefRe.exec(html)) !== null) {
          let href = match[1].trim();
          if (!href || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) {
            continue;
          }
          // Resolve relative URLs
          if (href.startsWith("/")) {
            href = `${base}${href}`;
          } else if (!href.startsWith("http")) {
            href = `${fullUrl.replace(/\/$/, "")}/${href}`;
          }
          // Normalize
          href = href.split("#")[0].split("?")[0].replace(/\/$/, "") || href;

          if (!allLinks.has(href)) {
            allLinks.set(href, new Set());
          }
          allLinks.get(href)!.add(pagePath);
        }
      })
    );
  }

  console.log(chalk.gray(` found ${allLinks.size} unique links\n`));

  // Step 2: HEAD-check each unique link
  const broken: { url: string; status: string; sources: string[] }[] = [];
  const entries = [...allLinks.entries()];

  for (let i = 0; i < entries.length; i += 10) {
    const batch = entries.slice(i, i + 10);
    await Promise.all(
      batch.map(async ([url, sources]) => {
        process.stdout.write(chalk.gray("."));
        try {
          const res = await fetch(url, {
            method: "HEAD",
            headers: { "User-Agent": "AraFinestraCLI/1.0" },
            redirect: "follow",
            signal: AbortSignal.timeout(10000),
          });
          if (res.status >= 400) {
            broken.push({
              url,
              status: String(res.status),
              sources: [...sources],
            });
          }
        } catch (err: any) {
          broken.push({
            url,
            status: err?.name === "TimeoutError" ? "TIMEOUT" : "NETWORK_ERR",
            sources: [...sources],
          });
        }
      })
    );
  }

  console.log("\n");

  if (broken.length === 0) {
    console.log(chalk.green("No broken links found!\n"));
    return;
  }

  const table = new Table({
    head: ["URL", "Status", "Found on"],
    style: { head: ["cyan"] },
    colWidths: [60, 12, 40],
    wordWrap: true,
  });

  for (const b of broken.sort((a, c) => a.status.localeCompare(c.status))) {
    table.push([
      b.url,
      chalk.red(b.status),
      b.sources.join("\n"),
    ]);
  }

  console.log(table.toString());
  console.log(
    chalk.bold(
      `\n${chalk.red(String(broken.length))} broken link(s) out of ${allLinks.size} checked.\n`
    )
  );
}

// ---------------------------------------------------------------------------
// seo lighthouse
// ---------------------------------------------------------------------------

async function lighthouseAction(
  url: string | undefined,
  _opts: Record<string, unknown>
): Promise<void> {
  const targetUrl = url || getBaseUrl();

  console.log(chalk.bold(`\nLighthouse Audit — ${targetUrl}\n`));

  try {
    const output = execSync(
      `npx lighthouse "${targetUrl}" --output=json --chrome-flags="--headless --no-sandbox" --quiet 2>/dev/null`,
      { encoding: "utf-8", maxBuffer: 50 * 1024 * 1024, timeout: 120000 }
    );

    const report = JSON.parse(output);
    const categories = report.categories || {};

    const table = new Table({
      head: ["Category", "Score"],
      style: { head: ["cyan"] },
    });

    for (const [key, cat] of Object.entries<any>(categories)) {
      const score = cat.score != null ? Math.round(cat.score * 100) : null;
      const label = cat.title || key;
      if (score === null) {
        table.push([label, chalk.gray("N/A")]);
      } else {
        const colored =
          score >= 90
            ? chalk.green(`${score}/100`)
            : score >= 50
              ? chalk.yellow(`${score}/100`)
              : chalk.red(`${score}/100`);
        table.push([label, colored]);
      }
    }

    console.log(table.toString());
    console.log();
  } catch (err: any) {
    if (
      err?.message?.includes("not found") ||
      err?.message?.includes("ENOENT") ||
      err?.stderr?.includes("not found")
    ) {
      console.error(
        chalk.red(
          "Lighthouse is not installed. Install it with:\n  npm install -g lighthouse\n"
        )
      );
    } else {
      console.error(
        chalk.red(`Lighthouse failed: ${err?.message ?? "unknown error"}\n`)
      );
    }
  }
}

// ---------------------------------------------------------------------------
// Register command
// ---------------------------------------------------------------------------

export function registerSeoCommand(program: Command): void {
  const seo = program
    .command("seo")
    .description("SEO monitoring and auditing tools");

  seo
    .command("audit")
    .description(
      "Full SEO audit — checks title, meta desc, h1, canonical, schema per page"
    )
    .option("--lang <lang>", "Language prefix to audit", "ca")
    .action(auditAction);

  seo
    .command("broken-links")
    .description("Crawl pages and report broken links (HTTP 4xx/5xx)")
    .option("--lang <lang>", "Language prefix to crawl", "ca")
    .action(brokenLinksAction);

  seo
    .command("lighthouse [url]")
    .description("Run Lighthouse audit and show score summary")
    .action(lighthouseAction);
}
