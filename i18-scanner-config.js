const typescriptTransform = require("i18next-scanner-typescript");

module.exports = {
  input: [
    "app/page.{js,jsx,ts,tsx}",
    "components/**/*.{js,jsx,ts,tsx}",
    "!components/Typography/**",
  ],
  output: "./public/locales",
  options: {
    removeUnusedKeys: true,
    func: {
      list: ["t", "i18n.t"],
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    trans: {
      component: "Trans",
      i18nKey: "i18nKey",
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    lngs: ["en"],
    defaultLng: "en",
    defaultValue: (lng, ns, key, defaultValue) => {
      return defaultValue || key;
    },
    resource: {
      loadPath: "./public/locales/{{lng}}/{{ns}}.json",
      savePath: "./public/locales/{{lng}}/{{ns}}.json",
      jsonIndent: 2,
      lineEnding: "\n",
    },
    attr: {
      list: ["i18nKey"],
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
  },
  transform: typescriptTransform(
    // options
    {
      // default value for extensions
      extensions: [".ts", ".tsx"],
      // optional ts configuration
      tsOptions: {
        target: "es2017",
      },
    }
  ),
};
