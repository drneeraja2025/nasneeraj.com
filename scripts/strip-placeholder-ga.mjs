/**
 * Remove placeholder Google Analytics (G-XXXXXXXXXX) blocks from HTML.
 * Run from repo root: node scripts/strip-placeholder-ga.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const gaBlock =
  /<!--\s*Google Analytics 4\s*-->[\s\S]*?<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-XXXXXXXXXX"><\/script>\s*<script>[\s\S]*?gtag\('config',\s*'G-XXXXXXXXXX'[\s\S]*?<\/script>\s*/gi;

// Also catch compact variants without the HTML comment
const gaBlock2 =
  /<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-XXXXXXXXXX"><\/script>\s*<script>[\s\S]*?gtag\('config',\s*'G-XXXXXXXXXX'[\s\S]*?<\/script>\s*/gi;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".git" || name === ".vercel") continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (name.endsWith(".html")) out.push(p);
  }
  return out;
}

let changed = 0;
for (const file of walk(root)) {
  let html = readFileSync(file, "utf8");
  const before = html;
  html = html.replace(gaBlock, "");
  html = html.replace(gaBlock2, "");
  if (html !== before) {
    writeFileSync(file, html, "utf8");
    changed++;
    console.log("stripped GA:", file.replace(root + "\\", "").replace(root + "/", ""));
  }
}
console.log(`Done. Updated ${changed} files.`);
