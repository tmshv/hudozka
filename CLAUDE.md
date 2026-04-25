# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Website for the Art School of Shlisselburg ([art.shlisselburg.org](https://art.shlisselburg.org)). Content is in Russian. Built with Next.js using the App Router and PocketBase as the backend (migrated from Strapi — see `pb/` and `src/remote/pb.ts`). The project has migrated through Express → Angular 1 → React class components → Next.js (Pages Router) → Next.js (App Router); some legacy artifacts remain.

## Commands

From repo root (delegates to `apps/hudozka`):

- `npm run dev` — dev server with Turbo (`next dev --turbo`)
- `npm run build` — production build
- `npm run lint` — Biome lint + format check across the whole monorepo (`biome check`)
- `npm run format` — auto-fix lint and format issues (`biome check --write`)
- `npm test` — run unit tests (Vitest) across every workspace

Per-app:

- `npm run dev -w apps/hudozka-writer` — writer UI (Vite)
- `npm run migrate -w apps/migrate-to-pocketbase` — one-off migration script

Node 24 required (see `mise.toml`). Deployed on Vercel.

## Git Workflow

Feature branches are named `issue-XXX` where `XXX` is the related GitHub issue number. PR descriptions should not include a test plan section.

## CI/CD

- `apps/hudozka/Dockerfile` — multi-stage Alpine build with standalone Next.js output, pushed to GHCR. Build context is the repo root so the workspace graph is available.
- `.github/workflows/build-app.yaml` — builds and pushes Docker image on push to master (`file: ./apps/hudozka/Dockerfile`, `context: ./`).
- `.github/workflows/test-app.yml` — runs lint, tests, typecheck, and build on PRs.

## Code Style

Biome (`biome.json`) handles formatting and linting. Style: no semicolons, double quotes, 4-space indentation, always-multiline trailing commas, LF line endings, 120-column line width. Lint scope is limited to `**/src/**/*.{ts,tsx,js}` via `files.includes`. Console calls are restricted to `console.error`/`console.warn` (full `console.*` is allowed only inside `apps/migrate-to-pocketbase`). `noDangerouslySetInnerHtml` is disabled because the site renders trusted CMS HTML. Inline `biome-ignore` / `eslint-disable` comments are not used — fix the underlying issue instead.

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

**App Router with SSG/ISR:** Pages are server components under `src/app/` with `export const revalidate = 30`. The root layout (`src/app/layout.tsx`) fetches menu data and passes it down. The catch-all route `src/app/[...slug]/page.tsx` handles all dynamic content pages with `generateStaticParams` and `generateMetadata`.

**Server/client boundary:** Layout and page components are server components that fetch data. The `App` component (`src/components/App`) is a `"use client"` component that provides the layout chrome (navigation, breadcrumbs, footer). Content is passed as `children` from server pages through the client boundary. Components using hooks (`PageGrid`, `HomeContent`, `PageContent`, `Menu`, `MobileNavigation`, `Wrapper`) are marked `"use client"`.

**Data flow:** PocketBase API → `src/remote/api.ts` fetches data via `apiGet()` generic wrapper → `src/remote/factory.ts` normalizes responses into app types (`src/types.ts`) → pages render token-based content blocks. The API layer uses a factory pattern with default-response fallbacks on failure. The legacy Strapi integration was removed (see commit "rm strapi"); `src/remote/pb.ts` is the PocketBase client.

**Metadata:** Uses the Next.js Metadata API (`generateMetadata`, `export const metadata`). The `buildMetadata()` helper in `src/lib/meta.ts` bridges the app's `Meta` type to Next.js `Metadata` format.

**Content tokens:** Pages are composed of flexible content blocks (tokens): `text`, `image`, `file`, `html`, `youtube`, `instagram`, `grid`. The `Token` discriminated union is defined in `src/types.ts`. Each token type maps to a renderer component in the `PageContent` client component.

**State management:** Valtio for reactive state (`src/store/`). Theme/accessibility preferences in `theme` store, playback state in `play` store.

## Key Directories

- `apps/hudozka/src/app/` — App Router pages, layouts, route handlers (catch-all, not-found, sitemap, robots, feed)
- `apps/hudozka/src/components/` — page-level and feature components (folder-per-component + `styles.module.css`)
- `apps/hudozka/src/ui/` — Next/store-coupled UI that stays in the app: `Picture`, `ThemeColor`
- `apps/hudozka/src/remote/` — PocketBase API client (`api.ts`, `factory.ts`, `types.ts`, `pb.ts`)
- `apps/hudozka/src/store/` — Valtio stores (theme/accessibility, playback)
- `apps/hudozka/src/hooks/` — business-coupled hooks: `useDarkTheme`, `useAccessibility`
- `apps/hudozka/src/lib/` — app-only lib (currently just `meta.ts`)
- `apps/hudozka/src/style/` — global CSS with CSS custom properties for theming
- `packages/ui/` — `@hudozka/ui` — reusable primitives (Box, Button, Panel, Title, Overlay)
- `packages/hooks/` — `@hudozka/hooks` — generic React hooks (useToggle, useLockBodyScroll, useMediaQuery, useMobile, useReducedMotion)
- `packages/utils/` — `@hudozka/utils` — pure utilities (array, string, url, math, image, file, date)
- `packages/text/` — `@hudozka/text` — markdown + typograf rendering
- `apps/hudozka-writer/` — Vite-based Tiptap editor
- `apps/migrate-to-pocketbase/` — one-off Strapi → PocketBase migration script
- `pb/` — PocketBase instance (data, migrations)

## Styling

CSS Modules (`.module.css`) for component-scoped styles. Global theme via CSS custom properties in `src/style/style.css`. No utility CSS framework. Uses `classnames` package for conditional class composition.

## TypeScript

Path alias: `@/*` → `src/*`. Strict mode enabled. Target ES2020. `moduleDetection: "force"` in tsconfig (required because Next.js auto-generates `.next/types/validator.ts` without exports, which breaks `verbatimModuleSyntax`). Use `@/` path alias for all local imports, not `src/`. Legacy `src/` imports exist in the codebase but should not be used in new or modified code. The `@/*` path alias is only configured in `apps/hudozka/tsconfig.json`; packages under `packages/*` use short relative imports.

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

- `src/types.ts` has `I`-prefix interfaces (`IPage`, `IMenu`, etc.) from the Angular era alongside modern `type` aliases. The `tokens` field on `IPage` is `any[]` despite a proper `Token` union type existing.
- `src/store/theme.ts` manipulates DOM directly outside React lifecycle (sets CSS vars on `document.documentElement`, toggles `document.body` classes).
- Two orphaned `.scss` files in `src/style/` (`tape-viewer.scss`, `vertical-image.scss`) — not imported anywhere, no SCSS preprocessor configured.
- Some inline styles in `src/components/App/index.tsx` should be CSS modules.
- `react-use` and `use-media` dependencies are unmaintained; only `useToggle` and `useLockBodyScroll` are used from `react-use`.

