import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve("/Users/jim/projects/SgcWeb/mock");
const envPath = path.join(repoRoot, ".env");
const outputPath = path.resolve("/Users/jim/projects/SgcWeb/mock/src/data/generated/sermons.json");

loadLocalEnv(envPath);

const endpoint = process.env.SERMONS_JSON_URL ?? process.argv[2] ?? "";

function loadLocalEnv(filePath) {
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    if (!key || process.env[key]) continue;

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

function normalizeBoolean(value) {
  if (typeof value === "boolean") return value;
  const normalized = normalizeString(String(value)).toLowerCase();
  return normalized === "true" || normalized === "yes" || normalized === "1" || normalized === "published";
}

function toDateLabel(date) {
  const match = normalizeString(date).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return normalizeString(date);
  const [, year, month, day] = match;
  return `${year}年${Number(month)}月${Number(day)}日`;
}

function toYoutubeWatchUrl(value) {
  const url = normalizeString(value);
  if (!url) return "";

  const embedMatch = url.match(/youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/);
  if (embedMatch) return `https://www.youtube.com/watch?v=${embedMatch[1]}`;

  const watchMatch = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  if (watchMatch) return `https://www.youtube.com/watch?v=${watchMatch[1]}`;

  return url;
}

function normalizeSermon(row, index) {
  const date = normalizeString(row.date);
  const title = normalizeString(row.title);

  if (!date || !title) {
    return null;
  }

  return {
    id: index + 1,
    status: normalizeString(row.status) || "published",
    date,
    dateLabel: normalizeString(row.dateLabel) || toDateLabel(date),
    speaker: normalizeString(row.speaker),
    title,
    passage: normalizeString(row.passage),
    series: normalizeString(row.series),
    description: normalizeString(row.description),
    youtubeUrl: toYoutubeWatchUrl(row.youtubeUrl),
    mp3Url: normalizeString(row.mp3Url),
    featured: normalizeBoolean(row.featured),
    notes: normalizeString(row.notes),
  };
}

function compareDescByDate(a, b) {
  return b.date.localeCompare(a.date);
}

if (!endpoint) {
  console.log("SERMONS_JSON_URL not set. Skipping remote sermon fetch and keeping existing generated JSON.");
  process.exit(0);
}

const response = await fetch(endpoint, {
  headers: {
    accept: "application/json",
  },
});

if (!response.ok) {
  throw new Error(`Failed to fetch sermons JSON: ${response.status} ${response.statusText}`);
}

const payload = await response.json();
const rawRows = Array.isArray(payload) ? payload : Array.isArray(payload.sermons) ? payload.sermons : null;

if (!rawRows) {
  throw new Error("Expected sermon payload to be an array or an object with a sermons array.");
}

const sermons = rawRows
  .filter((row) => normalizeString(row.status || "published") === "published")
  .map(normalizeSermon)
  .filter(Boolean)
  .sort(compareDescByDate)
  .map((item, index) => ({ ...item, id: index + 1 }));

if (sermons.length === 0) {
  throw new Error("Remote sermon payload contained no published sermon rows.");
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(sermons, null, 2)}\n`);

console.log(`Fetched ${sermons.length} sermons from ${endpoint}`);
