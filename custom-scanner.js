import fs from "fs/promises";
import path from "path";
import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";
import { glob } from "glob";
import crypto from "crypto";
import { autoKeyFromText } from "./lib/autoKey.js";

const { LOCALES } = await import("./i18n/constants.ts");
const traverse = traverseModule.default || traverseModule;

// timestamped logging ---------------------------------------------------------
function getTimestamp() {
  const now = new Date();
  return now.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
  });
}
function log(message) {
  console.log(`[${getTimestamp()}] ${message}`);
}

// config ----------------------------------------------------------------------
const config = {
  input: ["app/**/*.{ts,tsx,js,jsx}"],
  output: "./public/locales",
  locales: LOCALES,
  customComponents: [
    {
      component: "MUITypography",
      i18nKeyProp: "i18nKey",
      translateProp: "translate",
    },
  ],
};

// in-memory stores ------------------------------------------------------------
const translations = new Map();
const fileHashes = new Map();

// helpers ---------------------------------------------------------------------
function setNestedValue(obj, fullKey, value) {
  const keys = fullKey.split(".");
  let cursor = obj;
  for (let i = 0; i < keys.length - 1; i += 1) {
    const key = keys[i];
    cursor[key] ??= {};
    cursor = cursor[key];
  }
  cursor[keys.at(-1)] = value;
}
function flatToNested(flatEntries) {
  const nested = {};
  flatEntries.forEach(([key, value]) => setNestedValue(nested, key, value));
  return nested;
}
async function hashContent(content) {
  return crypto.createHash("md5").update(content).digest("hex");
}

// extraction ------------------------------------------------------------------
async function extractTranslations(filePath) {
  const code = await fs.readFile(filePath, "utf-8");
  const currentHash = await hashContent(code);
  if (fileHashes.get(filePath) === currentHash) return;
  fileHashes.set(filePath, currentHash);

  const ast = parse(code, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });

  traverse(ast, {
    CallExpression(path) {
      const callee = path.node.callee;
      if (
        callee?.name === "t" ||
        (callee?.object?.name === "i18n" && callee?.property?.name === "t")
      ) {
        const [keyNode, defaultNode] = path.node.arguments ?? [];
        if (keyNode?.type === "StringLiteral") {
          const key = keyNode.value;
          const defaultValue =
            defaultNode?.type === "StringLiteral" ? defaultNode.value : key;
          translations.set(key, defaultValue);
        }
      }
    },
    JSXElement(path) {
      const opening = path.node.openingElement;
      const componentName = opening?.name?.name;
      const customComponent = config.customComponents.find(
        ({ component }) => component === componentName
      );
      if (!customComponent) return;

      let shouldTranslate = true;
      let keyFromProp;

      opening.attributes.forEach((attr) => {
        if (!attr?.name?.name) return;
        if (
          attr.name.name === customComponent.i18nKeyProp &&
          attr?.value?.value
        ) {
          keyFromProp = attr.value.value;
        }
        if (attr.name.name === customComponent.translateProp) {
          if (!attr.value) {
            shouldTranslate = true;
          } else if (attr.value.type === "JSXExpressionContainer") {
            const expr = attr.value.expression;
            if (expr.type === "BooleanLiteral") shouldTranslate = expr.value;
          } else if (attr.value.type === "StringLiteral") {
            shouldTranslate = attr.value.value !== "false";
          }
        }
      });

      if (!shouldTranslate) return;

      const collected = path.node.children
        .map((node) => {
          if (node.type === "JSXText") return node.value;
          if (
            node.type === "JSXExpressionContainer" &&
            node.expression.type === "StringLiteral"
          ) {
            return node.expression.value;
          }
          return "";
        })
        .join("");

      const defaultValue = collected.trim();
      if (!defaultValue) return;

      // Use shared autoKeyFromText for consistent normalization
      const key = keyFromProp ?? autoKeyFromText(defaultValue);
      translations.set(key, defaultValue);
    },
  });
}

// scanning --------------------------------------------------------------------
async function scanFiles() {
  log("Starting file scan...");
  const globStart = performance.now();
  const patternResults = await Promise.all(
    config.input.map((pattern) => glob(pattern))
  );
  const files = [...new Set(patternResults.flat())];
  log(
    `Found ${files.length} unique file(s) across patterns (took ${(
      (performance.now() - globStart) /
      1000
    ).toFixed(2)}s)`
  );

  const parseStart = performance.now();
  await Promise.all(
    files.map(async (file) => {
      log(`Scanning: ${file}`);
      await extractTranslations(file);
    })
  );
  log(
    `Extraction complete. Total keys found: ${translations.size} (took ${(
      (performance.now() - parseStart) /
      1000
    ).toFixed(2)}s)`
  );
}

// translation + persistence ---------------------------------------------------
async function translateBatch(locale, entries) {
  if (locale === "en") return entries;

  const payload = {
    q: entries.map(([, value]) => value),
    source: "en",
    target: locale,
  };

  if (!payload.q.length) return entries;

  log(`Translating ${payload.q.length} text(s) to ${locale}...`);
  const apiStart = performance.now();
  const res = await fetch("http://localhost:8000/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const apiDuration = ((performance.now() - apiStart) / 1000).toFixed(2);

  if (!res.ok) throw new Error(`Translation API returned ${res.status}`);

  const result = await res.json();
  const translated = Array.isArray(result.translatedText)
    ? result.translatedText
    : [result.translatedText];

  log(`✓ Translation successful for ${locale} (took ${apiDuration}s)`);
  return entries.map(([key], index) => [key, translated[index]]);
}

async function persistLocale(locale, entries) {
  const start = performance.now();
  const outputDir = path.resolve(config.output);
  const outputFile = path.join(outputDir, `${locale}.json`);

  await fs.mkdir(outputDir, { recursive: true });

  try {
    await fs.unlink(outputFile);
    log(`Deleted previous ${locale}.json`);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    log(`No existing translation file found for ${locale}, creating new.`);
  }

  const nested = flatToNested(entries);
  await fs.writeFile(outputFile, JSON.stringify(nested, null, 2), "utf-8");
  log(
    `✓ Saved ${locale}.json (took ${(
      (performance.now() - start) /
      1000
    ).toFixed(2)}s)`
  );
}

async function saveTranslations() {
  log(`Processing ${config.locales.length} locale(s)...`);
  const entries = Array.from(translations.entries());

  for (const locale of config.locales) {
    log(`\n--- Processing locale: ${locale} ---`);
    try {
      const translatedEntries = await translateBatch(locale, entries);
      await persistLocale(locale, translatedEntries);
    } catch (error) {
      log(`✗ Locale ${locale} failed: ${error.message}`);
      log("Falling back to English strings for this locale.");
      await persistLocale(locale, entries);
    }
  }
}

// main ------------------------------------------------------------------------
const scriptStart = performance.now();
log("========================================");
log("Starting custom i18next scanner");
log("========================================\n");

await scanFiles();
await saveTranslations();

const totalDuration = ((performance.now() - scriptStart) / 1000).toFixed(2);
log("\n========================================");
log(`Scanner completed in ${totalDuration}s`);
log("========================================");
