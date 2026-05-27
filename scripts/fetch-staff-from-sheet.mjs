import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const envPath = path.join(repoRoot, ".env");
const outputPath = path.join(repoRoot, "src", "data", "generated", "staff.json");

loadLocalEnv(envPath);

const endpoint = process.env.STAFF_JSON_URL ?? process.argv[2] ?? "";

function loadLocalEnv(filePath) {
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    if (!key || Object.prototype.hasOwnProperty.call(process.env, key)) continue;

    let value = trimmed.slice(separatorIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeStaff(row, index) {
  const name = normalizeString(row.name);

  if (!name) {
    return null;
  }

  return {
    id: index + 1,
    status: normalizeString(row.status) || "published",
    name,
    role: normalizeString(row.role),
    bio: normalizeString(row.bio),
    hobbies: normalizeString(row.hobbies),
    imageUrl: normalizeString(row.imageUrl),
    email: normalizeString(row.email).replace(/\?$/, ""),
    sortOrder: normalizeNumber(row.sortOrder, index + 1),
    notes: normalizeString(row.notes),
  };
}

if (!endpoint) {
  console.log("STAFF_JSON_URL not set. Skipping remote staff fetch and keeping existing generated JSON.");
  process.exit(0);
}

const response = await fetch(endpoint, {
  headers: {
    accept: "application/json",
  },
});

if (!response.ok) {
  throw new Error(`Failed to fetch staff JSON: ${response.status} ${response.statusText}`);
}

const payload = await response.json();
const rawRows = Array.isArray(payload) ? payload : Array.isArray(payload.staff) ? payload.staff : null;

if (!rawRows) {
  throw new Error("Expected staff payload to be an array or an object with a staff array.");
}

const staff = rawRows
  .filter((row) => normalizeString(row.status || "published") === "published")
  .map(normalizeStaff)
  .filter(Boolean)
  .sort((a, b) => a.sortOrder - b.sortOrder)
  .map((item, index) => ({ ...item, id: index + 1 }));

if (staff.length === 0) {
  throw new Error("Remote staff payload contained no published staff rows.");
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(staff, null, 2)}\n`);

console.log(`Fetched ${staff.length} staff profiles from ${endpoint}`);
