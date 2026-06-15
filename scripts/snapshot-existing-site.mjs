import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const startUrl = process.argv[2] || "https://setagayagrace.jp/";
const outputRoot = process.argv[3] || "docs/previous-site/setagayagrace.jp-2026-06-04";
const maxPages = Number(process.env.SNAPSHOT_MAX_PAGES || 250);
const maxAssets = Number(process.env.SNAPSHOT_MAX_ASSETS || 1500);
const homepageOnly = process.env.SNAPSHOT_HOMEPAGE_ONLY === "1";

const start = new URL(startUrl);
const seen = new Map();
const pages = [];
const assets = [];
const failures = [];
const textRecords = [];
const pageQueue = [start.href];
const assetQueue = [];

const pageLikeTypes = new Set(["text/html", "application/xhtml+xml"]);
const allowedAssetHosts = new Set([
  start.hostname,
  "assets.squarespace.com",
  "static1.squarespace.com",
  "images.squarespace-cdn.com",
  "fonts.googleapis.com",
  "fonts.gstatic.com",
  "definitions.sqspcdn.com",
]);

await mkdir(outputRoot, { recursive: true });

function isPageUrl(url) {
  return url.origin === start.origin && !path.extname(url.pathname);
}

function stripHash(url) {
  url.hash = "";
  return url;
}

function urlToFile(url, contentType = "") {
  const host = url.hostname.replace(/[^a-z0-9.-]/gi, "_");
  const cleanPath = decodeURIComponent(url.pathname).replace(/^\/+/, "");
  const base = cleanPath || "index";
  const ext = path.extname(base);
  const type = contentType.split(";")[0].trim();
  let filePath = base;

  if (pageLikeTypes.has(type) || (!ext && url.origin === start.origin)) {
    filePath = path.join(base, "index.html");
  } else if (!ext) {
    filePath = `${base || "asset"}.bin`;
  }

  if (url.search) {
    const suffix = Buffer.from(url.search).toString("base64url").slice(0, 24);
    const parsed = path.parse(filePath);
    filePath = path.join(parsed.dir, `${parsed.name}.${suffix}${parsed.ext}`);
  }

  return path.join(outputRoot, "files", host, filePath);
}

function localHref(fromFile, targetFile) {
  let rel = path.relative(path.dirname(fromFile), targetFile);
  if (!rel.startsWith(".")) rel = `./${rel}`;
  return rel.split(path.sep).join("/");
}

function enqueue(raw, fromUrl, kind = "asset") {
  if (!raw || raw.startsWith("data:") || raw.startsWith("mailto:") || raw.startsWith("tel:")) return;
  try {
    const url = stripHash(new URL(raw, fromUrl));
    if (!["http:", "https:"].includes(url.protocol)) return;
    if (kind === "page" && url.origin === start.origin && isPageUrl(url)) {
      if (homepageOnly) return;
      if (!seen.has(url.href) && pages.length + pageQueue.length < maxPages) pageQueue.push(url.href);
      return;
    }
    if (kind === "asset" && allowedAssetHosts.has(url.hostname) && assets.length + assetQueue.length < maxAssets && !seen.has(url.href)) {
      assetQueue.push(url.href);
    }
  } catch {
    // Ignore malformed or template URLs.
  }
}

function discover(text, baseUrl, contentType) {
  if (contentType.includes("text/css")) {
    for (const match of text.matchAll(/url\((['"]?)([^'")]+)\1\)/g)) enqueue(match[2], baseUrl);
    for (const match of text.matchAll(/@import\s+(?:url\()?['"]([^'"]+)['"]/g)) enqueue(match[1], baseUrl);
    return;
  }

  if (!contentType.includes("html")) return;

  for (const match of text.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi)) enqueue(match[1], baseUrl, "page");
  for (const match of text.matchAll(/<(?:script|img|source|iframe|video|audio|embed|object)\b[^>]*\b(?:src|poster|data)=["']([^"']+)["'][^>]*>/gi)) {
    enqueue(match[1], baseUrl, "asset");
  }
  for (const match of text.matchAll(/<link\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi)) {
    const tag = match[0];
    if (/\brel=["'][^"']*(?:stylesheet|icon|preload|preconnect|modulepreload|apple-touch-icon)[^"']*["']/i.test(tag)) {
      enqueue(match[1], baseUrl, "asset");
    }
  }
  for (const match of text.matchAll(/<meta\b[^>]*\b(?:property|name|itemprop)=["'][^"']*(?:image|thumbnailUrl)[^"']*["'][^>]*\bcontent=["']([^"']+)["'][^>]*>/gi)) {
    enqueue(match[1], baseUrl, "asset");
  }
  for (const match of text.matchAll(/\bsrcset=["']([^"']+)["']/gi)) {
    for (const item of match[1].split(",")) enqueue(item.trim().split(/\s+/)[0], baseUrl, "asset");
  }
  for (const match of text.matchAll(/url\((['"]?)([^'")]+)\1\)/g)) enqueue(match[2], baseUrl, "asset");
}

function rewrite(text, baseUrl, fromFile) {
  return text
    .replace(/\b(href|src|poster|content)=["']([^"']+)["']/gi, (full, attr, raw) => {
      const file = seen.get(resolve(raw, baseUrl));
      return file ? `${attr}="${localHref(fromFile, file)}"` : full;
    })
    .replace(/\bsrcset=["']([^"']+)["']/gi, (full, rawSet) => {
      const rewritten = rawSet
        .split(",")
        .map((item) => {
          const parts = item.trim().split(/\s+/);
          const file = seen.get(resolve(parts[0], baseUrl));
          return file ? [localHref(fromFile, file), ...parts.slice(1)].join(" ") : item.trim();
        })
        .join(", ");
      return `srcset="${rewritten}"`;
    })
    .replace(/url\((['"]?)([^'")]+)\1\)/g, (full, quote, raw) => {
      const file = seen.get(resolve(raw, baseUrl));
      return file ? `url("${localHref(fromFile, file)}")` : full;
    });
}

function resolve(raw, baseUrl) {
  try {
    return stripHash(new URL(raw, baseUrl)).href;
  } catch {
    return "";
  }
}

async function fetchOne(rawUrl, isPage = false) {
  const url = new URL(rawUrl);
  if (seen.has(url.href)) return;
  const tempDir = await mkdtemp(path.join(tmpdir(), "sgc-snapshot-"));
  const headerFile = path.join(tempDir, "headers.txt");
  const bodyFile = path.join(tempDir, "body");
  try {
    const { stdout } = await execFileAsync("curl", [
      "-L",
      "-sS",
      "--compressed",
      "-A",
      "Mozilla/5.0 SGC snapshot crawler",
      "-D",
      headerFile,
      "-o",
      bodyFile,
      "-w",
      "%{http_code}",
      url.href,
    ], {
      encoding: "utf8",
      maxBuffer: 1024 * 1024,
    });
    const headerText = await readFile(headerFile, "utf8");
    const contentType = [...headerText.matchAll(/^content-type:\s*(.+)$/gim)].at(-1)?.[1]?.trim() || "";
    const status = Number(stdout.trim()) || 0;
    const bytes = await readFile(bodyFile);
    const file = urlToFile(url, contentType);
    seen.set(url.href, file);
    await mkdir(path.dirname(file), { recursive: true });

    if (contentType.includes("text/") || contentType.includes("javascript") || contentType.includes("json") || contentType.includes("xml")) {
      const original = bytes.toString("utf8");
      discover(original, url.href, contentType);
      textRecords.push({ file, url: url.href, original, contentType });
      await writeFile(file, original);
    } else {
      await writeFile(file, bytes);
    }

    const record = { url: url.href, status, contentType, bytes: bytes.length, file };
    if (isPage) pages.push(record);
    else assets.push(record);
  } catch (error) {
    failures.push({ url: url.href, error: error.message });
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

while (pageQueue.length) {
  await fetchOne(pageQueue.shift(), true);
}

while (assetQueue.length) {
  await fetchOne(assetQueue.shift(), false);
}

for (const record of textRecords) {
  await writeFile(record.file, rewrite(record.original, record.url, record.file));
}

const manifest = {
  capturedAt: new Date().toISOString(),
  startUrl,
  outputRoot,
  pages: pages.length,
  assets: assets.length,
  failures: failures.length,
  pageRecords: pages,
  assetRecords: assets,
  failuresRecords: failures,
};

await writeFile(path.join(outputRoot, "manifest.json"), JSON.stringify(manifest, null, 2));
await writeFile(
  path.join(outputRoot, "README.md"),
  [
    "# setagayagrace.jp snapshot",
    "",
    `Captured: ${manifest.capturedAt}`,
    `Start URL: ${startUrl}`,
    `Pages: ${pages.length}`,
    `Assets: ${assets.length}`,
    `Failures: ${failures.length}`,
    "",
    "Open `files/setagayagrace.jp/index/index.html` in a browser to inspect the mirrored homepage.",
    "See `manifest.json` for every downloaded URL and any failed requests.",
    "",
  ].join("\n"),
);

console.log(JSON.stringify({ pages: pages.length, assets: assets.length, failures: failures.length, outputRoot }, null, 2));
