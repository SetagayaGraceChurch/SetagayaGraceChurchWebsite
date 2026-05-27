import fs from "node:fs";
import path from "node:path";

const inputPath = process.argv[2] ?? "/private/tmp/sgc-sermons.html";
const outputPath =
  process.argv[3] ?? path.resolve("/Users/jim/projects/SgcWeb/mock/src/data/generated/sermons.json");

const html = fs.readFileSync(inputPath, "utf8");

function decodeHtml(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripTags(value) {
  return decodeHtml(value)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeJapaneseDigits(value) {
  return value.replace(/[０-９]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xfee0));
}

function normalizePunctuation(value) {
  return value
    .replace(/[～〜]/g, "〜")
    .replace(/[−–—]/g, "−")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeTitle(value) {
  return normalizePunctuation(value).replace(/^「|」$/g, "");
}

function normalizeSeries(value) {
  return normalizePunctuation(value).trim();
}

function extractTextItems(blockHtml) {
  return [...blockHtml.matchAll(/<(h4|p)[^>]*>([\s\S]*?)<\/\1>/g)]
    .map((match) => stripTags(match[2]))
    .map((text) => text.replace(/\u00a0/g, " ").trim())
    .filter(Boolean);
}

function parseDate(rawDate) {
  const normalized = normalizeJapaneseDigits(rawDate);
  const match = normalized.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  if (!match) {
    return { date: rawDate, dateLabel: rawDate };
  }

  const [, year, month, day] = match;
  return {
    date: `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
    dateLabel: `${year}年${Number(month)}月${Number(day)}日`,
  };
}

function splitSpeakerAndNotes(rawValue) {
  const value = normalizePunctuation(rawValue);
  const noteMatch = value.match(/(.*?)(（.+）|\(.+\))$/);
  const normalizeSpeaker = (speakerValue) => {
    let normalized = speakerValue.replace(/\s+牧師/g, "牧師").replace(/\s+([（(])/g, "$1").trim();
    if (!/[A-Za-z]/.test(normalized) && !normalized.includes("牧師") && !/[（()]/.test(normalized)) {
      normalized = normalized.replace(/\s+/g, "");
    }

    return normalized;
  };

  if (noteMatch) {
    return {
      speaker: normalizeSpeaker(noteMatch[1].trim()),
      notes: noteMatch[2].trim(),
    };
  }

  return { speaker: normalizeSpeaker(value), notes: "" };
}

function looksLikeNote(value) {
  return /^[（(].+[）)]$/.test(value.trim());
}

function looksLikeSpeaker(value) {
  const normalized = normalizePunctuation(value);
  return /牧師/.test(normalized) || (!looksLikeNote(normalized) && normalized.length <= 20);
}

const videoRegex = /https:\/\/www\.youtube\.com\/embed\/([A-Za-z0-9_-]{6,})\?feature=oembed/g;

const sermons = [];
let match;
let id = 1;

while ((match = videoRegex.exec(html)) !== null) {
  const youtubeId = match[1];
  const contextStart = Math.max(0, match.index - 4500);
  const context = html.slice(contextStart, match.index);
  const blocks = [...context.matchAll(/<div class="sqs-html-content" data-sqsp-text-block-content[^>]*>([\s\S]*?)<\/div>/g)];
  const metadataBlock = blocks.at(-1)?.[1];

  if (!metadataBlock) {
    continue;
  }

  const textItems = extractTextItems(metadataBlock);
  if (textItems.length < 4) {
    continue;
  }

  const rawDate = normalizePunctuation(textItems[0]);
  const passage = normalizePunctuation(textItems[1]);
  const title = normalizeTitle(textItems[2]);
  const tailItems = textItems.slice(3);
  let rawSpeakerValue = tailItems.at(-1) ?? "";
  let between = tailItems.slice(0, -1);
  let notes = "";

  if (looksLikeNote(rawSpeakerValue) && tailItems.length >= 2 && looksLikeSpeaker(tailItems.at(-2) ?? "")) {
    notes = rawSpeakerValue;
    rawSpeakerValue = tailItems.at(-2) ?? "";
    between = tailItems.slice(0, -2);
  }

  const parsedSpeaker = splitSpeakerAndNotes(rawSpeakerValue);
  const speaker = parsedSpeaker.speaker;
  notes = notes || parsedSpeaker.notes;
  const series = between.length > 0 ? normalizeSeries(between.join(" / ")) : "";
  const parsedDate = parseDate(rawDate);

  sermons.push({
    id,
    status: "published",
    date: parsedDate.date,
    dateLabel: parsedDate.dateLabel,
    speaker,
    title,
    passage,
    series,
    description: "",
    youtubeUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
    mp3Url: "",
    featured: id <= 3,
    notes,
  });

  id += 1;
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(sermons, null, 2)}\n`);

console.log(`Imported ${sermons.length} sermons to ${outputPath}`);
