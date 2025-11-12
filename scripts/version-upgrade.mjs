// Example: check-version.js
import fs from "fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const args = new Set(process.argv.slice(2));
const bumpMajor = args.has("--major");
const bumpMinor = args.has("--minor");
const bumpPatch = args.has("--patch");

if ([bumpMajor, bumpMinor, bumpPatch].filter(Boolean).length > 1) {
  console.error("Please specify only one of --major, --minor, or --patch");
  process.exit(1);
}

const rootDir = dirname(fileURLToPath(import.meta.url));
const projectDir = resolve(rootDir);

const packageJsonPath = resolve(projectDir, "../package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

let [major, minor, patch] = packageJson.version.split(".").map(Number);

if (bumpMajor) {
  major += 1;
  minor = 0;
  patch = 0;
}
if (bumpMinor) {
  minor += 1;
  patch = 0;
}

if (bumpPatch) patch += 1;

packageJson.version = `${major}.${minor}.${patch}`;

fs.writeFileSync(
  resolve(projectDir, "../package.json"),
  JSON.stringify(packageJson, null, 2)
);

console.log(`Version updated to ${packageJson.version}`);
console.log(
  `Bumped: ${bumpMajor ? "major " : ""}${bumpMinor ? "minor " : ""}${
    bumpPatch ? "patch" : "None"
  }`.trim()
);
