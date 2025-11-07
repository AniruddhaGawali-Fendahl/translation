import fs from 'fs';
import path from 'path';
import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';
import { glob } from 'glob';
const { LOCALES } = await import('./i18n/constants.ts');

// Fix for ES module import
const traverse = traverseModule.default || traverseModule;

// Configuration
const config = {
  input: ['app/**/*.{ts,tsx}'],
  output: './public/locales',
  locales: LOCALES,
  customComponents: [
    {
      component: 'MUITypography',
      i18nKeyProp: 'i18nKey',
      defaultValueProp: 'children',
    },
  ],
};

// Store extracted translations
const translations = {};

function extractTranslations(filePath) {
  const code = fs.readFileSync(filePath, 'utf-8');

  // Parse TypeScript/TSX code
  const ast = parse(code, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx'],
  });

  traverse(ast, {
    // Extract from t() function calls
    CallExpression(path) {
      const callee = path.node.callee;

      if (
        callee.name === 't' ||
        (callee.object?.name === 'i18n' && callee.property?.name === 't')
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
        (c) => c.component === componentName,
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
          if (child.type === 'JSXText') {
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
  config.locales.forEach(async (locale) => {
    const outputDir = path.join(config.output, '');
    const outputFile = path.join(config.output, locale + '.json');

    // Create directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Merge with existing translations
    let existing = {};
    if (fs.existsSync(outputFile)) {
      existing = JSON.parse(fs.readFileSync(outputFile, 'utf-8'));
    }

    // Translate all values for the current locale
    const translatedValues = {};

    if (locale !== 'en') {
      // Prepare all texts to translate in one call
      const textsToTranslate = Object.values(translations);

      if (textsToTranslate.length > 0) {
        try {
          const res = await fetch('http://localhost:8000/translate', {
            method: 'POST',
            body: JSON.stringify({
              q: textsToTranslate,
              source: 'en',
              target: locale,
            }),
            headers: { 'Content-Type': 'application/json' },
          });

          const result = await res.json();
          const translatedTexts = Array.isArray(result.translatedText)
            ? result.translatedText
            : [result.translatedText];

          // Map translated texts back to their keys
          Object.keys(translations).forEach((key, index) => {
            translatedValues[key] = translatedTexts[index];
          });

          console.log(`Translated ${translatedTexts.length} keys to ${locale}`);
        } catch (error) {
          console.error(`Translation failed for ${locale}:`, error);
          // Fallback to original translations if API fails
          Object.assign(translatedValues, translations);
        }
      }
    } else {
      // For English, use original translations
      Object.assign(translatedValues, translations);
    }

    const merged = { ...existing, ...translatedValues };

    // Write translations
    fs.writeFileSync(outputFile, JSON.stringify(merged, null, 2));
    console.log(`\nSaved translations to: ${outputFile}`);
    console.log(`Extracted ${Object.keys(translations).length} keys`);
  });
}

// Run the scanner
console.log('Starting custom i18next scanner...\n');
await scanFiles();
saveTranslations();
