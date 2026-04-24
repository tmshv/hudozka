import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import globals from "globals"

export default defineConfig([
    globalIgnores([
        "**/node_modules/**",
        "**/.next/**",
        "**/dist/**",
        "**/build/**",
        "**/out/**",
        "apps/hudozka/public/static/**",
        "pb/pb_data/**",
        "pb/pb_migrations/**",
        "**/next-env.d.ts",
    ]),
    {
        files: ["apps/hudozka/**/*.{js,jsx,ts,tsx}"],
        extends: nextVitals,
        rules: {
            "react/jsx-uses-react": "error",
            "react/jsx-uses-vars": "error",
        },
    },
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
        },
    },
])
