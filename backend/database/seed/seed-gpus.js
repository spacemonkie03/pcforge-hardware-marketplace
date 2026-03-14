const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const csvPath = path.join(__dirname, 'gpu_seed_series.csv');

const parseNullableInt = (value) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const parseCsv = (input) => {
  const [headerLine, ...rows] = input.trim().split(/\r?\n/);
  const headers = headerLine.split(',');

  return rows
    .map((row) => row.trim())
    .filter(Boolean)
    .map((row) => {
      const values = row.split(',');
      const record = headers.reduce((acc, header, index) => {
        acc[header] = values[index] ? values[index].trim() : '';
        return acc;
      }, {});

      return {
        name: record.name,
        slug: record.slug,
        manufacturer: record.manufacturer,
        architecture: record.architecture || null,
        release_year: parseNullableInt(record.release_year),
        process_nm: parseNullableInt(record.process_nm),
        vram_gb: parseNullableInt(record.vram_gb),
        memory_type: record.memory_type || null,
        memory_bus_width: parseNullableInt(record.memory_bus_width),
        pcie_version: record.pcie_version || null,
        tdp_watts: parseNullableInt(record.tdp_watts),
      };
    });
};

async function main() {
  if (!fs.existsSync(csvPath)) {
    throw new Error(`Seed file not found: ${csvPath}`);
  }

  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || 'pc_user',
    password: process.env.DB_PASS || 'pc_pass',
    database: process.env.DB_NAME || 'pc_hardware',
  });

  await client.connect();

  try {
    const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
    let insertedCount = 0;

    for (const row of rows) {
      const result = await client.query(
        `
          INSERT INTO gpus (
            name,
            slug,
            manufacturer,
            architecture,
            release_year,
            process_nm,
            vram_gb,
            memory_type,
            memory_bus_width,
            pcie_version,
            tdp_watts
          )
          VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
          )
          ON CONFLICT (slug) DO NOTHING
        `,
        [
          row.name,
          row.slug,
          row.manufacturer,
          row.architecture,
          row.release_year,
          row.process_nm,
          row.vram_gb,
          row.memory_type,
          row.memory_bus_width,
          row.pcie_version,
          row.tdp_watts,
        ]
      );

      insertedCount += result.rowCount || 0;
    }

    console.log(
      `Processed ${rows.length} GPU rows from ${csvPath} (${insertedCount} inserted, ${rows.length - insertedCount} skipped)`
    );
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
