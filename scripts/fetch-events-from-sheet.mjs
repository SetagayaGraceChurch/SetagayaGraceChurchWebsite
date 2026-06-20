import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const envPath = path.join(repoRoot, ".env");
const outputPath = path.join(repoRoot, "src", "data", "generated", "events.json");

loadLocalEnv(envPath);

const endpoint = process.env.EVENTS_JSON_URL ?? process.argv[2] ?? "";

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

function toSlug(value, fallback) {
  const source = normalizeString(value) || fallback;
  return source
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeBoolean(value) {
  if (typeof value === "boolean") return value;
  const normalized = normalizeString(String(value)).toLowerCase();
  return normalized === "true" || normalized === "yes" || normalized === "1" || normalized === "published";
}

function normalizeDateValue(value) {
  const raw = normalizeString(value);
  if (!raw) return "";

  const plainDateMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (plainDateMatch) return raw;

  const isoTimestampMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})T/);
  if (isoTimestampMatch) {
    const parsed = new Date(raw);
    if (!Number.isNaN(parsed.getTime())) {
      return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Tokyo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(parsed);
    }

    return `${isoTimestampMatch[1]}-${isoTimestampMatch[2]}-${isoTimestampMatch[3]}`;
  }

  return raw;
}

function toDateLabel(date) {
  const match = normalizeString(date).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return normalizeString(date);
  const [, year, month, day] = match;
  return `${year}年${Number(month)}月${Number(day)}日`;
}

function normalizeEvent(row, index) {
  const title = normalizeString(row.title);
  const date = normalizeDateValue(row.date);
  const endDate = normalizeDateValue(row.endDate);

  if (!title) {
    return null;
  }

  return {
    id: index + 1,
    status: normalizeString(row.status) || "published",
    eventType: normalizeString(row.eventType) || "event",
    slug: toSlug(row.slug, title),
    date,
    endDate,
    dateLabel: normalizeString(row.dateLabel) || toDateLabel(date),
    title,
    summary: normalizeString(row.summary || row.desc),
    description: normalizeString(row.description),
    imageKey: normalizeString(row.imageKey),
    imageUrl: normalizeString(row.imageUrl),
    applicationUrl: normalizeString(row.applicationUrl),
    applicationLabel: normalizeString(row.applicationLabel) || "参加申し込み",
    featured: normalizeBoolean(row.featured),
    notes: normalizeString(row.notes),
  };
}

function compareAscByDate(a, b) {
  if (!a.date && !b.date) return a.title.localeCompare(b.title);
  if (!a.date) return 1;
  if (!b.date) return -1;
  return a.date.localeCompare(b.date);
}

if (!endpoint) {
  console.log("EVENTS_JSON_URL not set. Skipping remote event fetch and keeping existing generated JSON.");
  process.exit(0);
}

const response = await fetch(endpoint, {
  headers: {
    accept: "application/json",
  },
});

if (!response.ok) {
  throw new Error(`Failed to fetch events JSON: ${response.status} ${response.statusText}`);
}

const payload = await response.json();
const rawRows = Array.isArray(payload) ? payload : Array.isArray(payload.events) ? payload.events : null;

if (!rawRows) {
  throw new Error("Expected event payload to be an array or an object with an events array.");
}

const events = rawRows
  .filter((row) => normalizeString(row.status || "published") === "published")
  .map(normalizeEvent)
  .filter(Boolean)
  .sort(compareAscByDate)
  .map((item, index) => ({ ...item, id: index + 1 }));

if (events.length === 0) {
  throw new Error("Remote event payload contained no published event rows.");
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(events, null, 2)}\n`);

console.log(`Fetched ${events.length} events from ${endpoint}`);
