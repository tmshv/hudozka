# Monorepo — Design

**Date:** 2026-04-24
**Status:** Approved, ready for plan

## Goal

Restructure the hudozka repo into an npm-workspaces monorepo. Consolidate the current Next.js app, the Vite-based `hudozka-writer`, and the Node-based `migrate-to-pocketbase` under `apps/`. Extract reusable UI primitives, hooks, and utilities into `packages/` scoped as `@hudozka/*`. Leave the PocketBase directory (`pb/`) untouched.

## Non-goals

- No behavioral changes to any app. This is a move + reorganization only.
- No adoption of `@hudozka/ui` or `@hudozka/hooks` inside `hudozka-writer`. Writer is relocated, not rewired.
- No Turborepo or other orchestration layer.
- No switch to built-output packages. Packages are consumed as TypeScript source.
- No publishing to npm. All packages are private workspace-only.

## Workspace layout

```
hudozka/
├─ apps/
│  ├─ hudozka/                    # Next.js app (was repo root)
│  │  ├─ app/
│  │  ├─ src/
│  │  ├─ public/
│  │  ├─ Dockerfile               # moved here from repo root
│  │  ├─ next.config.ts
│  │  ├─ tsconfig.json
│  │  └─ package.json
│  ├─ hudozka-writer/             # was modules/hudozka-writer
│  └─ migrate-to-pocketbase/      # was modules/migrate-to-pocketbase
├─ packages/
│  ├─ ui/                         # @hudozka/ui
│  ├─ hooks/                      # @hudozka/hooks
│  ├─ utils/                      # @hudozka/utils
│  └─ text/                       # @hudozka/text
├─ pb/                            # PocketBase — untouched
├─ docs/
├─ .github/workflows/
├─ package.json                   # workspaces only
├─ tsconfig.base.json
├─ eslint.config.js
├─ vitest.config.ts               # root web-app config stays; packages opt in
└─ mise.toml
```

App package names are **not** scoped (`hudozka`, `hudozka-writer`, `migrate-to-pocketbase`). Shared packages use the `@hudozka/*` scope.

## Package boundaries

All `packages/*` are consumed as TypeScript source. Each has:

```jsonc
{
  "name": "@hudozka/<name>",
  "private": true,
  "type": "module",
  "exports": { ".": "./src/index.ts" }
}
```

No build step. Next, Vite, and `node --experimental-strip-types` handle TS source natively.

### `@hudozka/utils`
- **Source:** `array.ts`, `string.ts`, `url.ts`, `math.ts`, `image.ts`, `file.ts`, `date.ts` (+ co-located `.test.ts`)
- **Runtime deps:** `date-fns`
- **Peer deps:** none
- **Consumers:** `apps/hudozka`; `apps/migrate-to-pocketbase` if it uses any

### `@hudozka/text`
- **Source:** `text.ts`
- **Runtime deps:** `markdown-it`, `typograf`
- **Dev deps:** `@types/markdown-it`
- **Peer deps:** none
- **Consumers:** `apps/hudozka`

### `@hudozka/hooks`
- **Source:** `useToggle.ts`, `useLockBodyScroll.ts`, `useMediaQuery.ts`, `useMobile.ts`, `useReducedMotion.ts` (+ co-located `.test.ts`)
- **Peer deps:** `react` (>=19)
- **Consumers:** `@hudozka/ui`, `apps/hudozka`

Business-coupled hooks (`useDarkTheme`, `useAccessibility` — depend on the Valtio theme store) stay in `apps/hudozka/src/hooks/`.

### `@hudozka/ui`
- **Components:** `Box`, `Button`, `Panel`, `Title`, `Overlay` (+ `Transition` subcomponent) with co-located `.test.tsx` and CSS Modules
- **Runtime deps:** `classnames`
- **Peer deps:** `react` (>=19), `react-dom` (>=19)
- **Workspace deps:** `@hudozka/hooks`
- **Consumers:** `apps/hudozka`

`Picture` (imports `next/image`, `next/link`, `useDarkTheme`) and `ThemeColor` (bridges Valtio theme store) **stay in `apps/hudozka/src/components/`** to avoid leaking Next and business state into shared packages.

### Dependency graph

```
apps/hudozka ─┬─> @hudozka/ui ──> @hudozka/hooks
              ├─> @hudozka/hooks
              ├─> @hudozka/utils
              └─> @hudozka/text

apps/hudozka-writer                            (no workspace deps — relocated only)

apps/migrate-to-pocketbase ──> @hudozka/utils   (optional; only if used)
```

Acyclic. `ui → hooks` is the only inter-package edge.

## TypeScript

### Root `tsconfig.base.json`

Shared compiler options:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "allowJs": true,
    "incremental": true
  }
}
```

### Per-workspace tsconfig

- `apps/hudozka/tsconfig.json` — extends base; adds `"plugins": [{ "name": "next" }]`; `"paths": { "@/*": ["src/*"] }`; includes `.next/types/**`.
- `apps/hudozka-writer/tsconfig.json` — moved as-is; updated to extend base.
- `apps/migrate-to-pocketbase/tsconfig.json` — new, minimal; extends base; Node-flavored `lib`.
- `packages/*/tsconfig.json` — extends base; `include: ["src/**/*"]`; no path aliases.

### Resolution

npm workspaces symlinks `@hudozka/*` into `node_modules`. `"exports"` points to source. No project references needed.

### Path aliases

`@/*` → `src/*` stays **only** in `apps/hudozka`. Packages use short relative imports. This matches the existing rule in the project's CLAUDE.md.

## ESLint

Single flat `eslint.config.js` at repo root. Changes vs. current:

- Drop `modules/` exclusion; add `apps/*/dist`, `apps/*/.next`, `public/static/` to global ignores.
- `eslint-config-next` scoped to `apps/hudozka/**` via a targeted config block.
- Style rules unchanged: no semicolons, double quotes, 4-space indent, always-multiline trailing commas, `eol-last`.

## Vitest

- `apps/hudozka/vitest.config.ts` and `apps/hudozka/vitest.setup.tsx` — moved as-is.
- `packages/ui/vitest.config.ts` and `packages/hooks/vitest.config.ts` — new, minimal; include jsdom/happy-dom setup for component tests.
- `packages/utils/vitest.config.ts` — new, no DOM setup needed.
- `packages/text/` — no tests currently; `test` script is a no-op runnable.

## Scripts

### Root `package.json`

```jsonc
{
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "npm run dev -w apps/hudozka",
    "build": "npm run build -w apps/hudozka",
    "start": "npm run start -w apps/hudozka",
    "lint": "eslint .",
    "format": "eslint --fix .",
    "test": "npm test --workspaces --if-present"
  }
}
```

- Root `dev`/`build`/`start` default to the web app (most common path).
- Other apps run via `-w`: `npm run dev -w apps/hudozka-writer`, `npm run migrate -w apps/migrate-to-pocketbase`.
- `--if-present` makes packages without a `test` script silent, not failing.

### Per-app/package scripts

- `apps/hudozka` — existing `dev`/`build`/`start`/`lint`/`format`/`test` relocated.
- `apps/hudozka-writer` — existing `dev`/`build`/`preview`.
- `apps/migrate-to-pocketbase` — existing `migrate`/`wipe`.
- `packages/*` — `test: vitest run` where applicable.

## Dev-dep hoisting

Shared tooling (`typescript`, `eslint`, `vitest`, `@testing-library/*`, `happy-dom`) lives only in the root `devDependencies`. Workspaces resolve them from the hoisted root `node_modules`. Apps declare their runtime deps in their own `dependencies`.

## CI / CD

### `.github/workflows/test-app.yml`

- `npm ci` at root, then `npm run lint` + `npm test` + `npm run build`.
- No per-workspace fan-out.

### `.github/workflows/build-app.yaml`

- `context:` stays `.` (repo root).
- `file:` becomes `./apps/hudozka/Dockerfile`.

### Dockerfile (at `apps/hudozka/Dockerfile`)

Multi-stage, workspace-aware:

1. **Install stage** — copy root `package.json`, `package-lock.json`, every `apps/*/package.json` + `packages/*/package.json`. Run `npm ci`.
2. **Build stage** — copy the rest of the monorepo. Run `npm run build -w apps/hudozka`.
3. **Runner** — copy `apps/hudozka/.next/standalone`, `apps/hudozka/.next/static`, `apps/hudozka/public` into the final image. Standalone output already bundles what it needs from `packages/*`.

Runtime path change: `./.next/standalone` → `./apps/hudozka/.next/standalone`.

## Migration sequencing

Each phase ends with a verification gate (`npm install` + lint + test + build all pass).

### Phase 1 — Workspace skeleton
- Add `workspaces: ["apps/*", "packages/*"]` to root `package.json`.
- Create empty `apps/`, `packages/` directories.
- Create `tsconfig.base.json`.
- **Gate:** `npm install` succeeds.

### Phase 2 — Relocate writer and migrate apps
- `git mv modules/hudozka-writer apps/hudozka-writer`
- `git mv modules/migrate-to-pocketbase apps/migrate-to-pocketbase`
- Update each app's tsconfig to extend `../../tsconfig.base.json` (writer already has a tsconfig; migrate gets a new minimal one).
- Remove empty `modules/` directory.
- **Gate:** `npm run dev -w apps/hudozka-writer` and `npm run migrate -w apps/migrate-to-pocketbase` work.

### Phase 3 — Relocate Next app to `apps/hudozka`
- `git mv` all top-level Next artifacts into `apps/hudozka/`: `app/`, `src/`, `public/`, `next.config.ts`, `next-env.d.ts`, `tsconfig.json`, `tsconfig.tsbuildinfo`, `vitest.config.ts`, `vitest.setup.tsx`, `eslint.config.js` (temporary; consolidated in phase 6), `Dockerfile`.
- Split root `package.json`: runtime deps + web-specific scripts move to `apps/hudozka/package.json`; root keeps only workspace config and shared dev deps.
- Update `apps/hudozka/tsconfig.json` to extend the root base.
- Update `.github/workflows/build-app.yaml` `file:` path.
- Update Dockerfile: context remains repo root; `COPY` paths now target `apps/hudozka/*`; adjust standalone output path.
- **Gate:** `dev`, `test`, `build` of `apps/hudozka` all pass.

### Phase 4 — Extract `@hudozka/utils`
- Create `packages/utils/` with `package.json`, `tsconfig.json`, `src/`, `src/index.ts`.
- `git mv` `array.ts`, `string.ts`, `url.ts`, `math.ts`, `image.ts`, `file.ts`, `date.ts` (+ tests) from `apps/hudozka/src/lib/` to `packages/utils/src/`.
- Move `date-fns` from `apps/hudozka/package.json` to `packages/utils/package.json`.
- Codemod imports in `apps/hudozka`: `@/lib/array` → `@hudozka/utils`, etc.
- **Gate:** lint + test + build pass.

### Phase 5 — Extract `@hudozka/text`, `@hudozka/hooks`, `@hudozka/ui`

Order: text → hooks → ui (ui depends on hooks).

- **`@hudozka/text`:** move `text.ts`, `markdown-it`, `typograf`, `@types/markdown-it`. Codemod imports.
- **`@hudozka/hooks`:** move `useToggle`, `useLockBodyScroll`, `useMediaQuery`, `useMobile`, `useReducedMotion` (+ tests). `useDarkTheme` and `useAccessibility` stay in `apps/hudozka`. Codemod imports.
- **`@hudozka/ui`:** move `Box`, `Button`, `Panel`, `Title`, `Overlay` (+ tests, CSS Modules). `Picture` and `ThemeColor` stay in `apps/hudozka/src/components/`. Move `classnames` dep. Codemod imports; Overlay's hook imports become `@hudozka/hooks`.
- **Gate after each package:** lint + test + build pass.

### Phase 6 — Consolidate ESLint & Vitest configs
- Move `eslint.config.js` from `apps/hudozka/` back to repo root; scope Next config to `apps/hudozka/**`.
- Add minimal `vitest.config.ts` (and setup where needed) to `packages/ui` and `packages/hooks`; `packages/utils` gets a non-DOM config.
- Update root `package.json` scripts as above.
- **Gate:** `npm run lint` at root lints everything; `npm test` runs all workspace tests.

### Phase 7 — Cleanup
- Delete orphaned files (stray `.DS_Store`, empty directories).
- Update root `README.md` with new layout (brief).
- Update root `CLAUDE.md` (Commands, Key Directories, Architecture paths).
- Spot-check `.github/workflows/*`, Dockerfile paths, `mise.toml`.

## Risks and mitigations

- **CSS Modules in `@hudozka/ui` consumed as source.** Next and Vite import `.module.css` natively; confirmed by current `src/ui/` usage. No build step needed. If a future consumer doesn't handle CSS, it must add that support itself.
- **Standalone Next output path change.** The Dockerfile runner copies a different path now. Explicit step in phase 3; guarded by the build gate.
- **Hoisted dev deps.** Different workspaces could theoretically disagree on major versions (e.g., `typescript`). Mitigation: all TS tooling lives only at the root; no workspace declares a conflicting version.
- **`experimental-strip-types` in `migrate-to-pocketbase`.** Still works when the script imports `@hudozka/utils` as source — Node strips types across the import boundary. Verified by the fact that utils has no non-TS-native syntax.
- **`eslint-config-next` globs.** Flat-config scoping must precisely target `apps/hudozka/**` to avoid leaking Next rules into packages. Phase 6 explicitly tests this by running `npm run lint` at root.

## Deferred

- Adopting `@hudozka/ui` or `@hudozka/hooks` in `apps/hudozka-writer`.
- Turborepo (revisit if build times or CI duration warrant it).
- Built-output packages + `.d.ts` emission (revisit if publishing or non-TS consumers appear).
- Further extraction from `apps/hudozka/src/` (e.g., splitting `remote/`, breaking up `components/`) — out of scope for this migration.
