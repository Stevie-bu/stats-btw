import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const client = createClient({
  projectId: "gecjcr03",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const data = JSON.parse(
  readFileSync(join(__dirname, "../data/betriebe.json"), "utf-8")
);

console.log(`Importing ${data.length} Betriebe...`);

const BATCH_SIZE = 100;

async function importBatch(batch, batchNum) {
  const transaction = client.transaction();
  for (const b of batch) {
    const id = `betrieb-${b.name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").slice(0, 96)}`;
    transaction.createOrReplace({
      _id: id,
      _type: "betrieb",
      name: b.name,
      ort: b.ort,
      mitarbeitende: b.mitarbeitende,
      teams: b.teams,
      beteiligung: b.beteiligung,
      veloanteil: b.veloanteil,
      distanz: b.distanz,
      co2: b.co2,
    });
  }
  await transaction.commit();
  console.log(`  Batch ${batchNum}: ${batch.length} entries imported`);
}

async function main() {
  for (let i = 0; i < data.length; i += BATCH_SIZE) {
    const batch = data.slice(i, i + BATCH_SIZE);
    await importBatch(batch, Math.floor(i / BATCH_SIZE) + 1);
  }
  console.log("Done!");
}

main().catch((err) => {
  console.error("Import failed:", err.message);
  process.exit(1);
});
