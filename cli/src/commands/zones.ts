import { Command } from "commander";
import chalk from "chalk";
import Table from "cli-table3";
import { apiGet, apiPost, apiPatch } from "../api.js";
import { generateZonePage } from "../lib/ai.js";
import { geocode } from "../lib/geo.js";
import { GIRONA_MUNICIPALITIES } from "../lib/municipalities.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function statusBadge(published: boolean): string {
  return published ? chalk.green("Publicat") : chalk.yellow("Esborrany");
}

function coordsLabel(lat: number | null, lon: number | null): string {
  if (lat != null && lon != null) {
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  }
  return chalk.dim("—");
}

async function fetchAllZones(): Promise<any[]> {
  const res = await apiGet("/api/zones");
  if (!res.ok) {
    console.error(chalk.red(`\n  Error fetching zones: ${res.status}\n`));
    process.exit(1);
  }
  return res.json();
}

async function fetchZoneBySlug(slug: string): Promise<any> {
  const res = await apiGet(`/api/zones/${slug}`);
  if (!res.ok) {
    if (res.status === 404) {
      console.error(chalk.red(`\n  Zone not found: ${slug}\n`));
    } else {
      console.error(chalk.red(`\n  Error fetching zone: ${res.status}\n`));
    }
    process.exit(1);
  }
  return res.json();
}

// ---------------------------------------------------------------------------
// zones list
// ---------------------------------------------------------------------------

async function listAction(): Promise<void> {
  const zones = await fetchAllZones();

  if (zones.length === 0) {
    console.log(chalk.dim("\n  No zones found.\n"));
    return;
  }

  const table = new Table({
    head: ["Slug", "Nom", "Estat", "Coords"],
    style: { head: ["cyan"] },
    colWidths: [28, 30, 14, 24],
    wordWrap: true,
  });

  for (const zone of zones) {
    table.push([
      zone.slug ?? "",
      zone.nombreCa ?? zone.nombreEs ?? "",
      statusBadge(!!zone.published),
      coordsLabel(zone.latitud ?? null, zone.longitud ?? null),
    ]);
  }

  console.log();
  console.log(table.toString());
  console.log(chalk.dim(`  Total: ${zones.length} zones\n`));
}

// ---------------------------------------------------------------------------
// zones add <municipality>
// ---------------------------------------------------------------------------

async function addAction(municipality: string): Promise<void> {
  console.log(
    chalk.cyan(`\n  Generating zone page for "${municipality}"...`)
  );
  console.log(chalk.dim("  AI content + geocoding in parallel.\n"));

  // Run AI generation and geocoding in parallel
  const [draft, coords] = await Promise.all([
    generateZonePage(municipality).catch((err: any) => {
      console.error(chalk.red(`  AI generation failed: ${err.message}\n`));
      process.exit(1);
    }),
    geocode(municipality).catch(() => null),
  ]);

  if (coords) {
    console.log(
      chalk.dim(`  Geocoded: ${coords.lat.toFixed(4)}, ${coords.lon.toFixed(4)}`)
    );
  } else {
    console.log(chalk.yellow("  Could not geocode municipality."));
  }

  // POST to API with auto-publish
  const body: Record<string, unknown> = {
    ...draft,
    published: true,
  };
  if (coords) {
    body.latitud = coords.lat;
    body.longitud = coords.lon;
  }

  const res = await apiPost("/api/zones", body);

  if (!res.ok) {
    const text = await res.text();
    console.error(chalk.red(`  Error creating zone: ${res.status} ${text}\n`));
    process.exit(1);
  }

  console.log(chalk.green("\n  Zone created and published!\n"));
  console.log(`  ${chalk.bold("Slug:")}      ${draft.slug}`);
  console.log(`  ${chalk.bold("Nom (CA):")} ${draft.nombreCa}`);
  console.log(`  ${chalk.bold("Nom (ES):")} ${draft.nombreEs}`);
  console.log(`  ${chalk.bold("Nom (EN):")} ${draft.nombreEn}`);
  if (coords) {
    console.log(
      `  ${chalk.bold("Coords:")}   ${coords.lat.toFixed(4)}, ${coords.lon.toFixed(4)}`
    );
  }
  console.log();
}

// ---------------------------------------------------------------------------
// zones batch <municipalities>
// ---------------------------------------------------------------------------

async function batchAction(municipalitiesStr: string): Promise<void> {
  const municipalities = municipalitiesStr
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);

  if (municipalities.length === 0) {
    console.error(
      chalk.red("\n  Please provide a comma-separated list of municipalities.\n")
    );
    process.exit(1);
  }

  console.log(
    chalk.cyan(
      `\n  Batch generating ${municipalities.length} zone pages...\n`
    )
  );

  let success = 0;
  let failed = 0;

  for (let i = 0; i < municipalities.length; i++) {
    const name = municipalities[i];
    const progress = `[${i + 1}/${municipalities.length}]`;

    console.log(chalk.dim(`  ${progress} ${name}...`));

    try {
      const [draft, coords] = await Promise.all([
        generateZonePage(name),
        geocode(name).catch(() => null),
      ]);

      const body: Record<string, unknown> = {
        ...draft,
        published: true,
      };
      if (coords) {
        body.latitud = coords.lat;
        body.longitud = coords.lon;
      }

      const res = await apiPost("/api/zones", body);
      if (!res.ok) {
        const text = await res.text();
        console.log(chalk.red(`    Error: ${res.status} ${text}`));
        failed++;
      } else {
        const coordInfo = coords
          ? ` (${coords.lat.toFixed(2)}, ${coords.lon.toFixed(2)})`
          : "";
        console.log(chalk.green(`    Created: ${draft.slug}${coordInfo}`));
        success++;
      }
    } catch (err: any) {
      console.log(chalk.red(`    Failed: ${err.message}`));
      failed++;
    }
  }

  console.log();
  console.log(
    chalk.bold(
      `  Done: ${chalk.green(`${success} created`)}${failed > 0 ? `, ${chalk.red(`${failed} failed`)}` : ""}\n`
    )
  );
}

// ---------------------------------------------------------------------------
// zones missing
// ---------------------------------------------------------------------------

async function missingAction(): Promise<void> {
  const zones = await fetchAllZones();
  const existingSlugs = new Set(zones.map((z: any) => z.slug as string));

  // Normalize name to slug for comparison
  function nameToSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  const missing = GIRONA_MUNICIPALITIES.filter(
    (m) => !existingSlugs.has(nameToSlug(m.name))
  ).sort((a, b) => b.pop - a.pop);

  if (missing.length === 0) {
    console.log(chalk.green("\n  All municipalities have zone pages!\n"));
    return;
  }

  const table = new Table({
    head: ["Municipi", "Població", "Slug"],
    style: { head: ["cyan"] },
    colWidths: [32, 14, 32],
  });

  for (const m of missing) {
    table.push([
      m.name,
      m.pop.toLocaleString("ca-ES"),
      chalk.dim(nameToSlug(m.name)),
    ]);
  }

  console.log();
  console.log(table.toString());
  console.log(
    chalk.dim(
      `  ${missing.length} municipalities missing (of ${GIRONA_MUNICIPALITIES.length} total)\n`
    )
  );
  console.log(
    chalk.dim(
      `  Add all: npm run cli -- zones batch "${missing.map((m) => m.name).join(",")}"\n`
    )
  );
}

// ---------------------------------------------------------------------------
// zones audit
// ---------------------------------------------------------------------------

async function auditAction(): Promise<void> {
  const zones = await fetchAllZones();

  if (zones.length === 0) {
    console.log(chalk.dim("\n  No zones to audit.\n"));
    return;
  }

  const table = new Table({
    head: ["Slug", "CA", "ES", "EN", "Meta", "Coords", "Score"],
    style: { head: ["cyan"] },
    colWidths: [28, 6, 6, 6, 6, 8, 8],
  });

  for (const zone of zones) {
    const checks = {
      ca: (zone.contenidoCa ?? "").length > 200,
      es: (zone.contenidoEs ?? "").length > 200,
      en: (zone.contenidoEn ?? "").length > 200,
      meta:
        !!(zone.metaTitleCa && zone.metaDescriptionCa) &&
        !!(zone.metaTitleEs && zone.metaDescriptionEs) &&
        !!(zone.metaTitleEn && zone.metaDescriptionEn),
      coords: zone.latitud != null && zone.longitud != null,
    };

    const score = Object.values(checks).filter(Boolean).length;
    const scoreColor =
      score === 5 ? chalk.green : score >= 3 ? chalk.yellow : chalk.red;

    table.push([
      zone.slug ?? "",
      checks.ca ? chalk.green("OK") : chalk.red("NO"),
      checks.es ? chalk.green("OK") : chalk.red("NO"),
      checks.en ? chalk.green("OK") : chalk.red("NO"),
      checks.meta ? chalk.green("OK") : chalk.red("NO"),
      checks.coords ? chalk.green("OK") : chalk.red("NO"),
      scoreColor(`${score}/5`),
    ]);
  }

  console.log();
  console.log(table.toString());

  const perfect = zones.filter((z: any) => {
    const hasCa = (z.contenidoCa ?? "").length > 200;
    const hasEs = (z.contenidoEs ?? "").length > 200;
    const hasEn = (z.contenidoEn ?? "").length > 200;
    const hasMeta =
      !!(z.metaTitleCa && z.metaDescriptionCa) &&
      !!(z.metaTitleEs && z.metaDescriptionEs) &&
      !!(z.metaTitleEn && z.metaDescriptionEn);
    const hasCoords = z.latitud != null && z.longitud != null;
    return hasCa && hasEs && hasEn && hasMeta && hasCoords;
  }).length;

  console.log(
    chalk.dim(
      `  ${perfect}/${zones.length} zones with perfect score (5/5)\n`
    )
  );
}

// ---------------------------------------------------------------------------
// zones publish / unpublish
// ---------------------------------------------------------------------------

async function publishAction(slug: string): Promise<void> {
  const zone = await fetchZoneBySlug(slug);

  if (zone.published) {
    console.log(chalk.yellow(`\n  Zone "${slug}" is already published.\n`));
    return;
  }

  const res = await apiPatch(`/api/zones/${zone.id}`, { published: true });
  if (!res.ok) {
    console.error(chalk.red(`\n  Error publishing zone: ${res.status}\n`));
    process.exit(1);
  }

  console.log(chalk.green(`\n  Zone "${slug}" published successfully!\n`));
}

async function unpublishAction(slug: string): Promise<void> {
  const zone = await fetchZoneBySlug(slug);

  if (!zone.published) {
    console.log(
      chalk.yellow(`\n  Zone "${slug}" is already unpublished.\n`)
    );
    return;
  }

  const res = await apiPatch(`/api/zones/${zone.id}`, { published: false });
  if (!res.ok) {
    console.error(chalk.red(`\n  Error unpublishing zone: ${res.status}\n`));
    process.exit(1);
  }

  console.log(
    chalk.green(`\n  Zone "${slug}" unpublished (set to draft).\n`)
  );
}

// ---------------------------------------------------------------------------
// Register command
// ---------------------------------------------------------------------------

export function registerZonesCommand(program: Command): void {
  const zones = program
    .command("zones")
    .description("Manage zone landing pages with AI generation and auto-publish");

  zones
    .command("list")
    .description("List all zones in a table")
    .action(listAction);

  zones
    .command("add <municipality>")
    .description("Generate a zone page with AI + geocode, auto-publish")
    .action(addAction);

  zones
    .command("batch <municipalities>")
    .description("Generate multiple zones (comma-separated list)")
    .action(batchAction);

  zones
    .command("missing")
    .description("Show municipalities without a zone page, sorted by population")
    .action(missingAction);

  zones
    .command("audit")
    .description("Audit zone quality: content, meta tags, coordinates (score /5)")
    .action(auditAction);

  zones
    .command("publish <slug>")
    .description("Publish a zone page")
    .action(publishAction);

  zones
    .command("unpublish <slug>")
    .description("Unpublish a zone page (set to draft)")
    .action(unpublishAction);
}
