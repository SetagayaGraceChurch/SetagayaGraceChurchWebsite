import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const envPath = path.join(repoRoot, ".env");
const outputPath = path.join(repoRoot, "src", "data", "generated", "sermons.json");

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

function toYoutubeWatchUrl(value) {
  const url = normalizeString(value);
  if (!url) return "";

  const embedMatch = url.match(/youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/);
  if (embedMatch) return `https://www.youtube.com/watch?v=${embedMatch[1]}`;

  const watchMatch = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  if (watchMatch) return `https://www.youtube.com/watch?v=${watchMatch[1]}`;

  return url;
}

const bibleBookAliases = [
  ["創世記", ["創世記"]],
  ["出エジプト記", ["出エジプト記", "出エジプト"]],
  ["レビ記", ["レビ記"]],
  ["民数記", ["民数記"]],
  ["申命記", ["申命記"]],
  ["ヨシュア記", ["ヨシュア記"]],
  ["士師記", ["士師記"]],
  ["ルツ記", ["ルツ記"]],
  ["サムエル記 第一", ["サムエル記第一", "サムエル記 第一", "第一サムエル記", "Ⅰサムエル記", "1サムエル記", "サムエル第一"]],
  ["サムエル記 第二", ["サムエル記第二", "サムエル記 第二", "第二サムエル記", "Ⅱサムエル記", "2サムエル記", "サムエル第二"]],
  ["列王記 第一", ["列王記第一", "列王記 第一", "第一列王記", "Ⅰ列王記", "1列王記", "列王第一"]],
  ["列王記 第二", ["列王記第二", "列王記 第二", "第二列王記", "Ⅱ列王記", "2列王記", "列王第二"]],
  ["歴代誌 第一", ["歴代誌第一", "歴代誌 第一", "第一歴代誌", "Ⅰ歴代誌", "1歴代誌", "歴代第一"]],
  ["歴代誌 第二", ["歴代誌第二", "歴代誌 第二", "第二歴代誌", "Ⅱ歴代誌", "2歴代誌", "歴代第二"]],
  ["エズラ記", ["エズラ記"]],
  ["ネヘミヤ記", ["ネヘミヤ記"]],
  ["エステル記", ["エステル記"]],
  ["ヨブ記", ["ヨブ記"]],
  ["詩篇", ["詩篇", "詩編"]],
  ["箴言", ["箴言"]],
  ["伝道者の書", ["伝道者の書", "伝道の書", "コヘレトの言葉"]],
  ["雅歌", ["雅歌"]],
  ["イザヤ書", ["イザヤ書"]],
  ["エレミヤ書", ["エレミヤ書"]],
  ["哀歌", ["哀歌"]],
  ["エゼキエル書", ["エゼキエル書"]],
  ["ダニエル書", ["ダニエル書"]],
  ["ホセア書", ["ホセア書"]],
  ["ヨエル書", ["ヨエル書"]],
  ["アモス書", ["アモス書"]],
  ["オバデヤ書", ["オバデヤ書"]],
  ["ヨナ書", ["ヨナ書"]],
  ["ミカ書", ["ミカ書"]],
  ["ナホム書", ["ナホム書"]],
  ["ハバクク書", ["ハバクク書"]],
  ["ゼパニヤ書", ["ゼパニヤ書"]],
  ["ハガイ書", ["ハガイ書"]],
  ["ゼカリヤ書", ["ゼカリヤ書"]],
  ["マラキ書", ["マラキ書"]],
  ["マタイの福音書", ["マタイの福音書", "マタイ福音書", "マタイ"]],
  ["マルコの福音書", ["マルコの福音書", "マルコ福音書", "マルコ"]],
  ["ルカの福音書", ["ルカの福音書", "ルカ福音書", "ルカ"]],
  ["ヨハネの福音書", ["ヨハネの福音書", "ヨハネ福音書", "ヨハネ"]],
  ["使徒の働き", ["使徒の働き", "使徒行伝", "使徒言行録", "使徒"]],
  ["ローマ人への手紙", ["ローマ人への手紙", "ローマ書", "ローマ"]],
  ["コリント人への手紙 第一", ["コリント人への手紙第一", "コリント人への手紙 第一", "第一コリント人への手紙", "Ⅰコリント人への手紙", "1コリント人への手紙", "第一コリント", "Ⅰコリント", "1コリント"]],
  ["コリント人への手紙 第二", ["コリント人への手紙第二", "コリント人への手紙 第二", "第二コリント人への手紙", "Ⅱコリント人への手紙", "2コリント人への手紙", "第二コリント", "Ⅱコリント", "2コリント"]],
  ["ガラテヤ人への手紙", ["ガラテヤ人への手紙", "ガラテヤ書", "ガラテヤ"]],
  ["エペソ人への手紙", ["エペソ人への手紙", "エフェソ人への手紙", "エペソ書", "エフェソ書", "エペソ", "エフェソ"]],
  ["ピリピ人への手紙", ["ピリピ人への手紙", "フィリピ人への手紙", "ピリピ書", "フィリピ書", "ピリピ", "フィリピ"]],
  ["コロサイ人への手紙", ["コロサイ人への手紙", "コロサイ書", "コロサイ"]],
  ["テサロニケ人への手紙 第一", ["テサロニケ人への手紙第一", "テサロニケ人への手紙 第一", "第一テサロニケ人への手紙", "Ⅰテサロニケ人への手紙", "1テサロニケ人への手紙", "第一テサロニケ", "Ⅰテサロニケ", "1テサロニケ"]],
  ["テサロニケ人への手紙 第二", ["テサロニケ人への手紙第二", "テサロニケ人への手紙 第二", "第二テサロニケ人への手紙", "Ⅱテサロニケ人への手紙", "2テサロニケ人への手紙", "第二テサロニケ", "Ⅱテサロニケ", "2テサロニケ"]],
  ["テモテへの手紙 第一", ["テモテへの手紙第一", "テモテへの手紙 第一", "第一テモテへの手紙", "Ⅰテモテへの手紙", "1テモテへの手紙", "第一テモテ", "Ⅰテモテ", "1テモテ"]],
  ["テモテへの手紙 第二", ["テモテへの手紙第二", "テモテへの手紙 第二", "第二テモテへの手紙", "Ⅱテモテへの手紙", "2テモテへの手紙", "第二テモテ", "Ⅱテモテ", "2テモテ"]],
  ["テトスへの手紙", ["テトスへの手紙", "テトス書", "テトス"]],
  ["ピレモンへの手紙", ["ピレモンへの手紙", "フィレモンへの手紙", "ピレモン書", "フィレモン書", "ピレモン", "フィレモン"]],
  ["ヘブル人への手紙", ["ヘブル人への手紙", "ヘブライ人への手紙", "ヘブル書", "ヘブライ書", "ヘブル", "ヘブライ"]],
  ["ヤコブの手紙", ["ヤコブの手紙", "ヤコブ書", "ヤコブ"]],
  ["ペテロの手紙 第一", ["ペテロの手紙第一", "ペテロの手紙 第一", "第一ペテロの手紙", "Ⅰペテロの手紙", "1ペテロの手紙", "第一ペテロ", "Ⅰペテロ", "1ペテロ"]],
  ["ペテロの手紙 第二", ["ペテロの手紙第二", "ペテロの手紙 第二", "第二ペテロの手紙", "Ⅱペテロの手紙", "2ペテロの手紙", "第二ペテロ", "Ⅱペテロ", "2ペテロ"]],
  ["ヨハネの手紙 第一", ["ヨハネの手紙第一", "ヨハネの手紙 第一", "第一ヨハネの手紙", "Ⅰヨハネの手紙", "1ヨハネの手紙", "第一ヨハネ", "Ⅰヨハネ", "1ヨハネ"]],
  ["ヨハネの手紙 第二", ["ヨハネの手紙第二", "ヨハネの手紙 第二", "第二ヨハネの手紙", "Ⅱヨハネの手紙", "2ヨハネの手紙", "第二ヨハネ", "Ⅱヨハネ", "2ヨハネ"]],
  ["ヨハネの手紙 第三", ["ヨハネの手紙第三", "ヨハネの手紙 第三", "第三ヨハネの手紙", "Ⅲヨハネの手紙", "3ヨハネの手紙", "第三ヨハネ", "Ⅲヨハネ", "3ヨハネ"]],
  ["ユダの手紙", ["ユダの手紙", "ユダ書", "ユダ"]],
  ["ヨハネの黙示録", ["ヨハネの黙示録", "黙示録"]],
];

function normalizePassageForBookMatch(value) {
  return normalizeString(value)
    .replace(/[ 　]/g, "")
    .replace(/[１２３４５６７８９０]/g, (digit) => String("１２３４５６７８９０".indexOf(digit)))
    .replace(/Ⅰ/g, "1")
    .replace(/Ⅱ/g, "2")
    .replace(/Ⅲ/g, "3")
    .replace(/第一/g, "1")
    .replace(/第二/g, "2")
    .replace(/第三/g, "3");
}

function extractBibleBook(passage) {
  const normalizedPassage = normalizePassageForBookMatch(passage);
  if (!normalizedPassage) return "";

  for (const [book, aliases] of bibleBookAliases) {
    if (aliases.some((alias) => normalizedPassage.startsWith(normalizePassageForBookMatch(alias)))) {
      return book;
    }
  }

  return "";
}

function normalizeSermon(row, index) {
  const date = normalizeDateValue(row.date);
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
    book: extractBibleBook(row.passage),
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
