import fs from "fs";
import path from "path";
import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";
import { glob } from "glob";
const { LOCALES } = await import("./i18n/constants.ts");

// Fix for ES module import
const traverse = traverseModule.default || traverseModule;

// Helper function to get formatted timestamp
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

// Helper function for logging with timestamp
function log(message) {
  console.log(`[${getTimestamp()}] ${message}`);
}

// Configuration
const config = {
  input: ["app/**/*.{ts,tsx}"],
  output: "./public/locales",
  locales: LOCALES,
  customComponents: [
    {
      component: "MUITypography",
      i18nKeyProp: "i18nKey",
      defaultValueProp: "children",
    },
  ],
};

// Store extracted translations
const translations = {};

// Helper function to convert flat keys to nested object
function setNestedValue(obj, path, value) {
  const keys = path.split(".");
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key]) {
      current[key] = {};
    }
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
}

// Helper function to convert flat object to nested
function flatToNested(flatObj) {
  const nested = {};

  Object.entries(flatObj).forEach(([key, value]) => {
    setNestedValue(nested, key, value);
  });

  return nested;
}

function extractTranslations(filePath) {
  const code = fs.readFileSync(filePath, "utf-8");

  // Parse TypeScript/TSX code
  const ast = parse(code, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });

  traverse(ast, {
    // Extract from t() function calls
    CallExpression(path) {
      const callee = path.node.callee;

      if (
        callee.name === "t" ||
        (callee.object?.name === "i18n" && callee.property?.name === "t")
      ) {
        const args = path.node.arguments;
        if (args.length > 0) {
          const key = args[0].value;
          const defaultValue = args[1]?.value || key;

          translations[key] = defaultValue;
        }
      }
    },

    // Extract from custom components
    JSXElement(path) {
      const openingElement = path.node.openingElement;
      const componentName = openingElement.name.name;

      // Check if it's one of our custom components
      const customComponent = config.customComponents.find(
        (c) => c.component === componentName
      );

      if (customComponent) {
        let i18nKey = null;
        let defaultValue = null;

        // Extract i18nKey from props
        openingElement.attributes.forEach((attr) => {
          if (attr.name?.name === customComponent.i18nKeyProp) {
            i18nKey = attr.value.value;
          }
        });

        // Extract default value from children
        if (path.node.children.length > 0) {
          const child = path.node.children[0];
          if (child.type === "JSXText") {
            defaultValue = child.value.trim();
          }
        }

        if (i18nKey && defaultValue) {
          translations[i18nKey] = defaultValue;
        }
      }
    },
  });
}

async function scanFiles() {
  log("Starting file scan...");
  for (const pattern of config.input) {
    const files = await glob(pattern);
    log(`Found ${files.length} file(s) matching pattern: ${pattern}`);

    files.forEach((file) => {
      log(`Scanning: ${file}`);
      extractTranslations(file);
    });
  }
  log(
    `Extraction complete. Total keys found: ${Object.keys(translations).length}`
  );
}

async function saveTranslations() {
  log(`Processing ${config.locales.length} locale(s)...`);

  for (const locale of config.locales) {
    const startTime = Date.now();
    log(`\n--- Processing locale: ${locale} ---`);

    const outputDir = path.join(config.output);
    const outputFile = path.join(config.output, locale + ".json");

    // Create directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      log(`Created directory: ${outputDir}`);
    }

    // Translate all values for the current locale
    const translatedValues = {};

    if (locale !== "en") {
      // Prepare all texts to translate in one call
      const textsToTranslate = Object.values(translations);

      if (textsToTranslate.length > 0) {
        log(`Translating ${textsToTranslate.length} text(s) to ${locale}...`);

        try {
          const apiStartTime = Date.now();
          const res = await fetch("http://localhost:8000/translate", {
            method: "POST",
            body: JSON.stringify({
              q: textsToTranslate,
              source: "en",
              target: locale,
            }),
            headers: { "Content-Type": "application/json" },
          });

          const apiEndTime = Date.now();
          const apiDuration = ((apiEndTime - apiStartTime) / 1000).toFixed(2);

          if (!res.ok) {
            throw new Error(`Translation API returned status ${res.status}`);
          }

          const result = await res.json();
          const translatedTexts = Array.isArray(result.translatedText)
            ? result.translatedText
            : [result.translatedText];

          // Map translated texts back to their keys
          Object.keys(translations).forEach((key, index) => {
            translatedValues[key] = translatedTexts[index];
          });

          log(`✓ Translation successful (took ${apiDuration}s)`);
          log(`Translated ${translatedTexts.length} key(s) to ${locale}`);
        } catch (error) {
          log(`✗ Translation failed for ${locale}: ${error.message}`);
          log(`Falling back to original English text...`);
          // Fallback to original translations if API fails
          Object.assign(translatedValues, translations);
        }
      }
    } else {
      log(`Using original English translations`);
      // For English, use original translations
      Object.assign(translatedValues, translations);
    }

    log(`Converting flat structure to nested hierarchy...`);
    // Convert flat structure to nested
    const nestedTranslations = flatToNested(translatedValues);

    // Merge with existing translations
    let existing = {};
    if (fs.existsSync(outputFile)) {
      existing = JSON.parse(fs.readFileSync(outputFile, "utf-8"));
      log(`Found existing translations, merging...`);
    }

    // Deep merge function
    function deepMerge(target, source) {
      const output = { ...target };

      for (const key in source) {
        if (
          source[key] &&
          typeof source[key] === "object" &&
          !Array.isArray(source[key])
        ) {
          output[key] = deepMerge(target[key] || {}, source[key]);
        } else {
          output[key] = source[key];
        }
      }

      return output;
    }

    const merged = deepMerge(existing, nestedTranslations);

    // Write translations
    fs.writeFileSync(outputFile, JSON.stringify(merged, null, 2));

    const endTime = Date.now();
    const totalDuration = ((endTime - startTime) / 1000).toFixed(2);

    log(`✓ Saved translations to: ${outputFile}`);
    log(`Keys extracted: ${Object.keys(translations).length}`);
    log(`Total time for ${locale}: ${totalDuration}s`);
  }
}

// Run the scanner
const scriptStartTime = Date.now();
log("========================================");
log("Starting custom i18next scanner");
log("========================================\n");

await scanFiles();
await saveTranslations();

const scriptEndTime = Date.now();
const totalScriptDuration = ((scriptEndTime - scriptStartTime) / 1000).toFixed(
  2
);

log("\n========================================");
log(`Scanner completed in ${totalScriptDuration}s`);
log("========================================");
