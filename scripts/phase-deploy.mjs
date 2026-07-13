#!/usr/bin/env node
/**
 * Phase deploy: local build preflight → push → poll Vercel via GitHub Deployments → logs on failure.
 * Project settings: scripts/phase-deploy.config.json
 */

import { execSync, spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(readFileSync(join(__dirname, "phase-deploy.config.json"), "utf8"));
const GIT = config.gitExecutable || "git";
const REPO = config.repo;
const PROJECT_FILTER = config.projectFilter;

const ENVS = {
  production: {
    branch: config.production.branch,
    label: config.production.label,
    matchEnv: (name) =>
      name.includes(PROJECT_FILTER) && name.toLowerCase().includes("production"),
  },
  preview: {
    branch: config.preview.branch,
    label: config.preview.label,
    matchEnv: (name) =>
      name.toLowerCase().includes("preview") ||
      name.toLowerCase().includes("development") ||
      (name.includes(PROJECT_FILTER) && !name.toLowerCase().includes("production")),
  },
};

function parseArgs(argv) {
  const out = { env: null, skipBuild: false, skipPush: false, timeoutSec: 900 };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--env") out.env = argv[++i];
    else if (a === "--skip-build") out.skipBuild = true;
    else if (a === "--skip-push") out.skipPush = true;
    else if (a === "--timeout") out.timeoutSec = Number(argv[++i]) || 900;
    else if (a === "--help" || a === "-h") out.help = true;
  }
  return out;
}

function run(cmd, opts = {}) {
  return execSync(cmd, { encoding: "utf8", stdio: opts.silent ? "pipe" : "inherit", ...opts });
}

function runCapture(cmd) {
  return execSync(cmd, { encoding: "utf8", stdio: "pipe" }).trim();
}

function ghApi(path, jq) {
  const jqPart = jq ? ` --jq '${jq.replace(/'/g, "'\\''")}'` : "";
  const raw = runCapture(`gh api ${path}${jqPart}`);
  return raw ? JSON.parse(raw) : null;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function printHelp() {
  const prod = config.production;
  const prev = config.preview;
  console.log(`Phase deploy — ${config.projectName || REPO}

Options:
  --env production|preview   Target environment (required)
  --skip-build               Skip local build preflight
  --skip-push                Only watch deployment for current HEAD (no git push)
  --timeout <seconds>        Poll timeout (default 900)

Environments:
  production  → push origin ${prod.branch}  → ${prod.url || "see Vercel dashboard"}
  preview     → push origin ${prev.branch}  → ${prev.url || "Vercel preview URL"}
`);
}

async function localBuild() {
  if (config.build?.skip) {
    console.log("\n▶ Build preflight skipped (config.build.skip)\n");
    return;
  }
  const cmd = config.build?.command || "npm run build";
  const cwd = config.build?.cwd || process.cwd();
  console.log(`\n▶ Local preflight: ${cmd}${cwd !== process.cwd() ? ` (cwd: ${cwd})` : ""}`);
  const r = spawnSync(cmd, { stdio: "inherit", shell: true, cwd });
  if (r.status !== 0) {
    console.error("\n✗ Local build failed. Fix errors before pushing.");
    process.exit(1);
  }
  console.log("✓ Local build passed\n");
}

function gitPush(branch) {
  const dirty = runCapture(`"${GIT}" status --porcelain`);
  if (dirty) {
    console.error("✗ Uncommitted changes. Commit first, then re-run phase deploy.");
    process.exit(3);
  }

  const current = runCapture(`"${GIT}" branch --show-current`);
  if (current !== branch) {
    console.log(`⚠ On branch "${current}" but --env targets "${branch}". Pushing ${branch} ref to origin.`);
  }

  console.log(`▶ ${GIT} push origin ${branch}`);
  try {
    run(`"${GIT}" push origin ${branch}`);
  } catch {
    console.error("✗ git push failed");
    process.exit(3);
  }

  const pushedSha = runCapture(`"${GIT}" rev-parse origin/${branch}`);
  console.log(`✓ Pushed ${branch} @ ${pushedSha.slice(0, 7)}\n`);
  return pushedSha;
}

function findDeployment(deployments, sha, matchEnv) {
  return deployments.find((d) => d.sha.startsWith(sha.slice(0, 7)) && matchEnv(d.environment));
}

async function waitForDeployment(sha, matchEnv, timeoutSec) {
  const deadline = Date.now() + timeoutSec * 1000;
  let deployment = null;

  console.log(`▶ Waiting for Vercel deployment (sha ${sha.slice(0, 7)})…`);

  while (Date.now() < deadline) {
    const deployments = ghApi(`repos/${REPO}/deployments?per_page=15`);
    deployment = findDeployment(deployments, sha, matchEnv);

    if (deployment) {
      const statuses = ghApi(`repos/${REPO}/deployments/${deployment.id}/statuses`);
      const latest = statuses[0];
      if (latest) {
        const state = latest.state;
        process.stdout.write(`  … ${state} (${latest.description?.slice(0, 60) || "no description"})\r`);
        if (state === "success") {
          console.log(`\n✓ Deployment succeeded`);
          console.log(`  URL: ${latest.environment_url || latest.target_url || "(see Vercel dashboard)"}`);
          return { ok: true, deployment, status: latest };
        }
        if (state === "failure" || state === "error") {
          console.log(`\n✗ Deployment failed`);
          return { ok: false, deployment, status: latest };
        }
      }
    }

    await sleep(15_000);
  }

  console.error("\n✗ Timed out waiting for deployment");
  process.exit(4);
}

function fetchVercelLogs(description) {
  const match = description?.match(/dpl_[A-Za-z0-9]+/);
  if (!match) return null;

  const dplId = match[0];
  console.log(`\n▶ Fetching Vercel build logs (${dplId})…`);
  try {
    const env = { ...process.env, NODE_OPTIONS: "--use-system-ca" };
    const logs = execSync(`npx vercel inspect ${dplId} --logs`, {
      encoding: "utf8",
      stdio: "pipe",
      env,
      shell: true,
      maxBuffer: 10 * 1024 * 1024,
    });
    return logs.split("\n").slice(-80).join("\n");
  } catch (e) {
    const out = e.stdout?.toString() || e.stderr?.toString() || String(e);
    return out.split("\n").slice(-80).join("\n");
  }
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help || !args.env) {
    printHelp();
    process.exit(args.help ? 0 : 2);
  }

  const cfg = ENVS[args.env];
  if (!cfg) {
    console.error(`Unknown --env "${args.env}". Use production or preview.`);
    process.exit(2);
  }

  console.log(`\n══ Phase deploy: ${cfg.label} ══\n`);

  if (!args.skipBuild) await localBuild();

  const sha = args.skipPush
    ? runCapture(`"${GIT}" rev-parse origin/${cfg.branch}`)
    : gitPush(cfg.branch);

  const result = await waitForDeployment(sha, cfg.matchEnv, args.timeoutSec);

  if (result.ok) {
    console.log("\nDone.");
    process.exit(0);
  }

  const desc = result.status?.description || "";
  console.log(`\nFailure details:\n  ${desc}`);

  const logs = fetchVercelLogs(desc);
  if (logs) {
    console.log("\n── Build log (last 80 lines) ──\n");
    console.log(logs);
    console.log("\n── End log ──");
  } else {
    console.log("\n(Open the deployment in Vercel dashboard for full logs.)");
  }

  console.log("\n→ Agent: read the error above, fix the code, commit, and re-run phase deploy.");
  process.exit(2);
}

main().catch((e) => {
  console.error(e);
  process.exit(99);
});
