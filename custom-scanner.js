import fs from "fs";
import path from "path";
import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";
import { glob } from "glob";

// Fix for ES module import
const traverse = traverseModule.default || traverseModule;

// Configuration
const config = {
  input: ["app/**/*.{ts,tsx}"],
  output: "./public/locales",
  locales: ["en"],
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
  for (const pattern of config.input) {
    const files = await glob(pattern);
    files.forEach((file) => {
      console.log(`Scanning: ${file}`);
      extractTranslations(file);
    });
  }
}

function saveTranslations() {
  config.locales.forEach((locale) => {
    const outputDir = path.join(config.output, locale);
    const outputFile = path.join(outputDir, "translation.json");

    // Create directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Merge with existing translations
    let existing = {};
    if (fs.existsSync(outputFile)) {
      existing = JSON.parse(fs.readFileSync(outputFile, "utf-8"));
    }

    const merged = { ...existing, ...translations };

    // Write translations
    fs.writeFileSync(outputFile, JSON.stringify(merged, null, 2));
    console.log(`\nSaved translations to: ${outputFile}`);
    console.log(`Extracted ${Object.keys(translations).length} keys`);
  });
}

// Run the scanner
console.log("Starting custom i18next scanner...\n");
await scanFiles();
saveTranslations();
