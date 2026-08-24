import "dotenv/config";
import path from "path";
import bcrypt from "bcrypt";
import { readdir, readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { parse } from "csv-parse/sync";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { fieldTypes } from "./types.js";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db"
});

const prisma = new PrismaClient({ adapter });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const directory = path.join(__dirname, "csv");

// Array til definition af rækkefølge
const order = [
  'user',
  'category',
  'product',
  'comment',
] as const;

type SeedModelName = typeof order[number];

async function main() {
  try {
    console.log("Clearing database...");

    // Slet i reverse order pga. relations
    for (const model of [...order].reverse()) {
      console.log(`Deleting ${model}...`);
      await (prisma as any)[model].deleteMany();
    }

    console.log("Database cleared\n");

    const files = await readdir(directory);

    for (const model of order) {
      const file = `${model}.csv`;

      if (!files.includes(file)) {
        console.log(`Skipping ${model} (no CSV)`);
        continue;
      }

      console.log(`Seeding ${model}...`);

      const fullpath = path.join(directory, file);
      const content = await readFile(fullpath, "utf-8");

      const rawRecords = parse(content, {
        columns: true,
        skip_empty_lines: true
      });

      const cleanedData = await Promise.all(
        rawRecords.map((row: unknown) => castRow(model, row as Record<string, any>))
      );

      await (prisma as any)[model].createMany({
        data: cleanedData
      });

      console.log(`${model} seeded (${cleanedData.length} rows)\n`);
    }

    console.log("SEED COMPLETE");
  } catch (error) {
    console.error("SEED FAILED:", error);
  } finally {
    await prisma.$disconnect();
  }
}

type FieldType = "string" | "number" | "boolean" | "date";

// DATA CASTING
const castRow = async (model: SeedModelName, row: Record<string, any>) => {
  const schema = fieldTypes[model] as Record<string, FieldType>;
  const converted: Record<string, any> = {};

  for (const [key, value] of Object.entries(row)) {
    const type: FieldType = schema[key] || "string";
    const val = value?.toString().trim();

    if (type === "number") {
      converted[key] = Number(val);
    } else if (type === "boolean") {
      converted[key] = val === "1" || val === "true";
    } else if (type === "date") {
      converted[key] = new Date(val);
    } else {
      if (key === "password") {
        converted[key] = await bcrypt.hash(val, 10);
      } else {
        converted[key] = val;
      }
    }
  }

  return converted;
};

main();