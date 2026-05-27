import fs from "node:fs";
import path from "node:path";

const targetDir = path.resolve(process.argv[2] ?? "dist");
const textExtensions = new Set([".html", ".xml", ".txt", ".json", ".js", ".css"]);

function walk(dir) {
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

let cleanedCount = 0;

for (const filePath of walk(targetDir)) {
  if (!textExtensions.has(path.extname(filePath))) continue;

  const contents = fs.readFileSync(filePath);
  if (!contents.includes(0)) continue;

  fs.writeFileSync(filePath, contents.filter((byte) => byte !== 0));
  cleanedCount += 1;
}

if (cleanedCount > 0) {
  console.log(`Removed NUL bytes from ${cleanedCount} text build artifact(s).`);
}
