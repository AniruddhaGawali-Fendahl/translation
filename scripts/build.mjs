import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const rootDir = dirname(fileURLToPath(import.meta.url));
const projectDir = resolve(rootDir, "..");
const extraArgs = process.argv.slice(2);
const versionArgs = extraArgs.length ? ` ${extraArgs.join(" ")}` : "";

const run = (command) =>
  execSync(command, { stdio: "inherit", cwd: projectDir });

run(`node ${resolve(projectDir, "scripts/custom-scanner.mjs")}`);
run(`node ${resolve(projectDir, "scripts/version-upgrade.mjs")}${versionArgs}`);
run("next build");
