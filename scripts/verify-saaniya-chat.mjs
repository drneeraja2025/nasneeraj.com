/**
 * Done-when check that does not call the model:
 * index contains SISLMS and contact, and retrieval returns a relative source path.
 */
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);

const built = spawnSync(process.execPath, ["scripts/build-site-index.mjs"], {
  cwd: root,
  stdio: "inherit",
});
if (built.status !== 0) process.exit(built.status || 1);

const index = require(join(root, "data/site-index.json"));
const { retrieve } = require(join(root, "api/lib/retrieve.js"));
const avatar = join(root, "assets/mascot/girl/saaniya-chat-avatar.png");

function assert(name, ok, detail) {
  if (!ok) {
    console.error(`FAIL ${name}: ${detail}`);
    process.exit(1);
  }
  console.log(`ok ${name}: ${detail}`);
}

assert("avatar", existsSync(avatar), "saaniya-chat-avatar.png");

const sislms = retrieve(index.chunks, "What is SISLMS?", 5);
assert(
  "sislms",
  sislms.some((hit) => hit.path.startsWith("/")),
  sislms.map((hit) => hit.path).join(", ") || "no hits"
);

const contact = retrieve(index.chunks, "How do I contact you?", 5);
assert(
  "contact",
  contact.some((hit) => hit.path === "/contact" || /contact/i.test(hit.path + hit.text)),
  contact.map((hit) => hit.path).join(", ") || "no hits"
);

console.log("verify-saaniya-chat passed");
