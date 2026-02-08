# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Website for the Art School of Shlisselburg ([art.shlisselburg.org](https://art.shlisselburg.org)). Content is in Russian. Built with Next.js using the Pages Router and Strapi headless CMS as the backend. The project has migrated through Express → Angular 1 → React class components → Next.js; some legacy artifacts remain.

## Commands

- `npm run dev` — dev server with Turbo (`next dev --turbo`)
- `npm run build` — production build
- `npm run lint` — ESLint checks
- `npm run format` — auto-fix lint issues
- `npm test` — run unit tests (Vitest, non-watch mode)

Node 22 required (see `mise.toml`). Deployed on Vercel.

## Git Workflow

Feature branches are named `issue-XXX` where `XXX` is the related GitHub issue number. PR descriptions should not include a test plan section.

## CI/CD

- `Dockerfile` — multi-stage Alpine build with standalone Next.js output, pushed to GHCR
- `.github/workflows/build-app.yaml` — builds and pushes Docker image on push to master
- `.github/workflows/test-app.yml` — runs lint, tests, and build on PRs (build runs only after lint and tests pass)

## Code Style

ESLint 9 flat config (`eslint.config.js`) using `FlatCompat` from `@eslint/eslintrc` to bridge `eslint-config-next` (which doesn't support native flat config in Next.js 15.x). Extends `next/core-web-vitals`. Enforces: no semicolons, double quotes, 4-space indentation, always-multiline trailing commas, `eol-last`.

**React components:** Use regular function declarations (not arrow functions) and `type` for props. Do not use `React.FC`.

```tsx
export type MyComponentProps = {
    value: string
}

export function MyComponent({ value }: MyComponentProps) {
    return <div>{value}</div>
}
```

## Dependencies

When adding or updating packages in `package.json`, do not specify the PATCH version — use `^MAJOR.MINOR.0`. The exact patch version is managed by the lockfile and `npm update`.

## Architecture

**Pages Router with SSG/ISR:** All pages use `getStaticProps`/`getStaticPaths` with 30-second revalidation. The catch-all route `pages/[...slug].tsx` handles all dynamic content pages.

**Data flow:** Strapi CMS API (`hudozka.tmshv.com`) → `src/remote/api.ts` fetches data via `apiGet()` generic wrapper → `src/remote/factory.ts` normalizes CMS responses into app types (`src/types.ts`) → pages render token-based content blocks. The API layer uses a factory pattern with default-response fallbacks on failure.

**Content tokens:** Pages are composed of flexible content blocks (tokens): `text`, `image`, `file`, `html`, `youtube`, `instagram`, `grid`. The `Token` discriminated union is defined in `src/types.ts`. Each token type maps to a renderer component.

**State management:** Valtio for reactive state (`src/store/`). Theme/accessibility preferences in `theme` store, playback state in `play` store, school contact info and year range in `config` store. Navigation data passed via React Context (`src/context/MenuContext`).

## Key Directories

- `src/components/` — page-level and feature components (folder-per-component with `index.tsx` + `styles.module.css`)
- `src/ui/` — reusable primitives (Box, Button, Picture, Panel, Overlay, Title, ThemeColor)
- `src/remote/` — Strapi API integration (`api.ts` for fetching, `factory.ts` for transforms, `types.ts` for CMS response shapes)
- `src/store/` — Valtio stores (theme/accessibility, playback config)
- `src/hooks/` — custom hooks (`useMobile`, `useAccessibility`, `useDarkTheme`, `useReducedMotion`)
- `src/lib/` — pure utility functions (date, string, url, image, file helpers)
- `src/style/` — global CSS with CSS custom properties for theming
- `modules/` — ancillary packages (strapi API client, sync tools, writer); excluded from tsconfig

## Styling

CSS Modules (`.module.css`) for component-scoped styles. Global theme via CSS custom properties in `src/style/style.css`. No utility CSS framework. Uses `classnames` package for conditional class composition.

## TypeScript

Path alias: `@/*` → `src/*`. Strict mode enabled. Target ES6. `moduleDetection: "force"` in tsconfig (required because Next.js auto-generates `.next/types/validator.ts` without exports, which breaks `verbatimModuleSyntax`). Use `@/` path alias for all local imports, not `src/`. Legacy `src/` imports exist in the codebase but should not be used in new or modified code.

`verbatimModuleSyntax` is enabled — use `import type` for type-only imports. When importing both values and types from the same module, use separate `import` and `import type` statements:

```ts
import { createPage } from "@/remote/factory"
import type { Page } from "@/types"
```

## Accessibility

The site has an accessibility panel with configurable font size (8-48pt), color schemes (5 presets: black-on-white, white-on-black, blue-on-blue, brown-on-yellow, green-on-brown), line height, letter spacing, image toggling, and serif/sans-serif font choice — all managed through the Valtio theme store. The theme store currently applies changes via direct DOM manipulation in a Valtio `subscribe()` callback (`src/store/theme.ts`).

## Images

Remote images from `hudozkacdn.tmshv.com` with `images.weserv.nl` as proxy. Blur hash encoding for progressive loading (uses `sharp` server-side). Image optimization configured in `next.config.ts` via `remotePatterns`.

## Testing

Vitest for unit tests. Config in `vitest.config.ts` with `@/` and `src/` path aliases. Test files are co-located with source across `src/lib/`, `src/ui/`, and `src/components/`. Covers utility functions (array, string, url, file, image, date, text, meta), UI primitives (Box, Button, Panel), and components (Breadcrumbs, YMetrika).

## Known Legacy / Technical Debt

Active modernization is tracked in GitHub issues #222–#238. Key items:

- `pages/_app.tsx` is the only class component (extends `App`). Should be a function component.
- `src/types.ts` has `I`-prefix interfaces (`IPage`, `IMenu`, etc.) from the Angular era alongside modern `type` aliases. The `tokens` field on `IPage` is `any[]` despite a proper `Token` union type existing.
- `src/store/theme.ts` manipulates DOM directly outside React lifecycle (sets CSS vars on `document.documentElement`, toggles `document.body` classes). Has a TODO to fix after App Router migration.
- Two orphaned `.scss` files in `src/style/` (`tape-viewer.scss`, `vertical-image.scss`) — not imported anywhere, no SCSS preprocessor configured.
- Some inline styles in `src/components/App/index.tsx` should be CSS modules.
- `react-use` and `use-media` dependencies are unmaintained; only `useToggle` and `useLockBodyScroll` are used from `react-use`.
