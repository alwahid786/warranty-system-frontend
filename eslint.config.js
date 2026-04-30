import js from "@eslint/js";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([
    "dist",
    "out/**",
    "build/**",
    "node_modules/**",
    "*.config.js",
    "*.config.mjs",
  ]),
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "react-refresh": reactRefresh,
      import: importPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...reactRefresh.configs.vite.rules,

      // Custom Rules
      "no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "react/display-name": "off",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error",

      // Layout & Aesthetics
      "lines-around-comment": [
        "error",
        {
          beforeBlockComment: true,
          beforeLineComment: true,
          allowBlockStart: true,
        },
      ],
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
        {
          blankLine: "any",
          prev: ["const", "let", "var"],
          next: ["const", "let", "var"],
        },
        {
          blankLine: "always",
          prev: "*",
          next: ["function", "multiline-const"],
        },
        {
          blankLine: "always",
          prev: ["function", "multiline-const"],
          next: "*",
        },
      ],
      "newline-before-return": "error",

      // Import Organization
      "import/newline-after-import": ["error", { count: 1 }],
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            ["internal", "parent", "sibling", "index"],
          ],
          pathGroups: [
            { pattern: "react", group: "external", position: "before" },
            { pattern: "@/**", group: "internal" },
          ],
          pathGroupsExcludedImportTypes: ["react"],
          "newlines-between": "always",
        },
      ],

      // Prettier
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
          singleQuote: false,
          semi: true,
          trailingComma: "none",
        },
      ],
    },
    settings: {
      react: { version: "detect" },
    },
  },
  prettierConfig,
]);
