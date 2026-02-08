import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import globals from "globals"

export default defineConfig([
    globalIgnores([
        ".next/**",
        "out/**",
        "build/**",
        "modules/**",
        "public/static/**",
        "next-env.d.ts",
    ]),
    ...nextVitals,
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
