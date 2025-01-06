import globals from "globals";
import pluginJs from "@eslint/js";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  prettierConfig,
  {
    plugins: {
      prettier: prettierPlugin,
    },

    rules: {
      "prettier/prettier": [
        "warn",
        {
          printWidth: 80,
          tabWidth: 2,
          trailingComma: "all",
          endOfLine: "auto",
          arrowParens: "always",
          semi: true,
        },
      ],
      "no-unused-vars": "warn",
    },
  },
];
