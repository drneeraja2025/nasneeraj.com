/**
 * Inject cookie-consent.js before </body> on HTML pages that lack it and lack site-nav.js.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const tag =
  '<script src="/assets/cookie-consent.js?v=20261013a" data-saaniya-cookie="1" defer></script>\n';

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

let n = 0;
for (const file of walk(root)) {
  let html = readFileSync(file, "utf8");
  if (/cookie-consent\.js/.test(html)) continue;
  if (/site-nav\.js/.test(html)) continue; // site-nav loads consent dynamically
  if (!/<\/body>/i.test(html)) continue;
  html = html.replace(/<\/body>/i, tag + "</body>");
  writeFileSync(file, html, "utf8");
  n++;
  console.log("injected:", file.replace(root + "\\", "").replace(root + "/", ""));
}
console.log(`Done. Injected ${n} files.`);
