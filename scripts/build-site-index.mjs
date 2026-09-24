/**
 * Build data/site-index.json from public HTML for Saaniya's site search.
 * Run: node scripts/build-site-index.mjs
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const skipName = /^(social-|avatar-options|video-script|NAS_BROCHURE)/i;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name.startsWith(".")) continue;
    const full = join(dir, name);
    const rel = relative(root, full).replace(/\\/g, "/");
    if (statSync(full).isDirectory()) {
      if (rel === "docs" || rel === "scripts" || rel === "api" || rel === "legal") {
        if (rel === "legal") walk(full, out);
        continue;
      }
      if (rel === "privacy") walk(full, out);
      continue;
    }
    if (!name.endsWith(".html")) continue;
    if (skipName.test(name)) continue;
    if (rel === "guruvidyazen.html") continue;
    out.push(full);
  }
  return out;
}

function decode(text) {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&[a-z]+;/gi, " ");
}

function pagePath(file) {
  const rel = relative(root, file).replace(/\\/g, "/").replace(/\.html$/i, "");
  if (rel === "index") return "/";
  return `/${rel}`;
}

function extract(html) {
  const title = decode((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [null, ""])[1])
    .replace(/\s+/g, " ")
    .trim();
  let body = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  body = decode(body).replace(/\s+/g, " ").trim();
  return { title, body };
}

function chunkText(text, size = 900, overlap = 120) {
  const parts = [];
  if (text.length <= size) return [text];
  let i = 0;
  while (i < text.length && parts.length < 8) {
    let end = Math.min(text.length, i + size);
    if (end < text.length) {
      const space = text.lastIndexOf(" ", end);
      if (space > i + 200) end = space;
    }
    parts.push(text.slice(i, end).trim());
    if (end >= text.length) break;
    i = Math.max(end - overlap, i + 1);
  }
  return parts.filter(Boolean);
}

const chunks = [];
for (const file of walk(root)) {
  const html = readFileSync(file, "utf8");
  const { title, body } = extract(html);
  if (body.length < 40) continue;
  const path = pagePath(file);
  chunkText(body).forEach((text, index) => {
    chunks.push({
      id: `${path}#${index}`,
      path,
      title: title || path,
      text,
    });
  });
}

const outDir = join(root, "data");
mkdirSync(outDir, { recursive: true });
const outFile = join(outDir, "site-index.json");
writeFileSync(outFile, JSON.stringify({ builtAt: new Date().toISOString(), chunks }, null, 2));
console.log(`Wrote ${chunks.length} chunks to data/site-index.json`);
