import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);

if (args.length < 2 || args.includes("--help") || args.includes("-h")) {
  printUsage();
  process.exit(args.length < 2 ? 1 : 0);
}

const sourceDir = path.resolve(args[0]);
const outputDir = path.resolve(args[1]);
const publicBaseUrl = getOptionValue("--public-base-url");
const shouldMove = args.includes("--move");

if (!fs.existsSync(sourceDir) || !fs.statSync(sourceDir).isDirectory()) {
  throw new Error(`Source folder does not exist: ${sourceDir}`);
}

fs.mkdirSync(outputDir, { recursive: true });

const files = listFiles(sourceDir).filter((filePath) => filePath.toLowerCase().endsWith(".mp3"));
const rows = [];
const skipped = [];
const usedOutputPaths = new Set();

for (const filePath of files) {
  const originalName = path.basename(filePath);
  const parsed = parseSermonFilename(originalName);

  if (!parsed) {
    skipped.push({ filePath, reason: "Could not parse leading date/title pattern" });
    continue;
  }

  let targetName = `${parsed.date}.mp3`;
  let targetPath = path.join(outputDir, targetName);
  let duplicateIndex = 2;

  while (usedOutputPaths.has(targetPath) || fs.existsSync(targetPath)) {
    targetName = `${parsed.date}-${duplicateIndex}.mp3`;
    targetPath = path.join(yearDir, targetName);
    duplicateIndex += 1;
  }

  usedOutputPaths.add(targetPath);

  if (shouldMove) {
    fs.renameSync(filePath, targetPath);
  } else {
    fs.copyFileSync(filePath, targetPath);
  }

  const newKey = targetName;
  rows.push({
    date: parsed.date,
    old_filename: originalName,
    new_key: newKey,
    title_guess: parsed.title,
    mp3_url: publicBaseUrl ? `${publicBaseUrl.replace(/\/+$/, "")}/${newKey}` : "",
  });
}

rows.sort((a, b) => a.date.localeCompare(b.date) || a.old_filename.localeCompare(b.old_filename));
skipped.sort((a, b) => a.filePath.localeCompare(b.filePath));

const csvPath = path.join(outputDir, "sermon-audio-map.csv");
fs.writeFileSync(csvPath, toCsv(rows), "utf8");

const skippedPath = path.join(outputDir, "sermon-audio-skipped.csv");
if (skipped.length > 0) {
  fs.writeFileSync(skippedPath, toCsv(skipped), "utf8");
}

console.log(`${shouldMove ? "Moved" : "Copied"} ${rows.length} MP3 file(s).`);
console.log(`CSV written to: ${csvPath}`);

if (skipped.length > 0) {
  console.log(`Skipped ${skipped.length} file(s). Details written to: ${skippedPath}`);
}

function getOptionValue(name) {
  const index = args.indexOf(name);
  if (index === -1) return "";
  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`${name} requires a value.`);
  }
  return value;
}

function listFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const result = [];

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...listFiles(entryPath));
    } else if (entry.isFile()) {
      result.push(entryPath);
    }
  }

  return result;
}

function parseSermonFilename(filename) {
  const match = filename.match(/^(\d{1,2})[.:-](\d{1,2})[.:-](\d{4})\s*(.*?)\s*\.mp3$/iu);

  if (!match) return null;

  const [, monthRaw, dayRaw, year, restRaw] = match;
  const month = Number(monthRaw);
  const day = Number(dayRaw);

  if (!isValidDate(year, month, day)) return null;

  const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const title = extractTitle(restRaw);

  return { date, day, month, title, year };
}

function extractTitle(value) {
  const rest = value.trim();
  if (!rest) return "";

  const parenthesized = rest.match(/^[\(（]\s*(.*?)\s*[\)）]/u);
  if (parenthesized) return parenthesized[1].trim();

  return rest;
}

function isValidDate(year, month, day) {
  const parsed = new Date(Date.UTC(Number(year), month - 1, day));
  return (
    parsed.getUTCFullYear() === Number(year) &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

function toCsv(items) {
  if (items.length === 0) return "";

  const headers = Object.keys(items[0]);
  const lines = [headers.join(",")];

  for (const item of items) {
    lines.push(headers.map((header) => csvEscape(item[header] ?? "")).join(","));
  }

  return `${lines.join("\n")}\n`;
}

function csvEscape(value) {
  const text = String(value);
  if (!/[",\n\r]/.test(text)) return text;
  return `"${text.replaceAll('"', '""')}"`;
}

function printUsage() {
  console.log(`Usage:
  node scripts/prepare-sermon-audio.mjs <source-folder> <output-folder> [--public-base-url <url>] [--move]

Example:
  node scripts/prepare-sermon-audio.mjs ~/Downloads/sermon-audio ~/Desktop/sermon-audio-clean --public-base-url https://pub-example.r2.dev

Input filename format:
  6.14.2026(イエスのあわれみ）.mp3

Output:
  <output-folder>/2026-06-14.mp3
  <output-folder>/sermon-audio-map.csv

By default the script copies files. Add --move only after confirming the copied output is correct.`);
}
