import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"
import { defineConfig, globalIgnores } from "eslint/config"
import globals from "globals"

const __dirname = dirname(fileURLToPath(import.meta.url))

const compat = new FlatCompat({
    baseDirectory: __dirname,
})

export default defineConfig([
    globalIgnores([
        ".next/**",
        "out/**",
        "build/**",
        "modules/**",
        "public/static/**",
        "next-env.d.ts",
    ]),
    ...compat.extends("next/core-web-vitals"),
    {
        languageOptions: {
            globals: globals.browser,
        },
    },
    {
        rules: {
            semi: ["error", "never"],
            indent: ["warn", 4],
            quotes: ["warn", "double"],
            "eol-last": ["error", "always"],
            "comma-dangle": ["error", "always-multiline"],
            "no-tabs": "error",
            "no-var": "error",
            "space-before-function-paren": "off",
            "react/jsx-uses-react": "error",
            "react/jsx-uses-vars": "error",
        },
    },
])
