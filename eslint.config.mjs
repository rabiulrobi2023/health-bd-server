import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    rules: {
      "no-unused-vars": "error",
      "no-const-assign": "error",
      "no-console": "warn",
      "@typescript-eslint/consistent-type-definitions": "off",
    },
  }
);
