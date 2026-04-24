# [ART.SHLISSELBURG.ORG](https://art.shlisselburg.org)

Website for the Art School of Shlisselburg. Built with Next.js and powered by PocketBase (migrated from Strapi).

Font: [«Shadow»](http://mishapanfilov.ru/font_shadow.html)

## Repo layout

This is an npm-workspaces monorepo:

- `apps/hudozka` — main Next.js app (art.shlisselburg.org)
- `apps/hudozka-writer` — Vite-based content editor
- `apps/migrate-to-pocketbase` — one-off migration script (Strapi → PocketBase)
- `packages/ui` — `@hudozka/ui` — shared React primitives (Box, Button, Panel, Title, Overlay)
- `packages/hooks` — `@hudozka/hooks` — generic React hooks
- `packages/utils` — `@hudozka/utils` — pure utilities (array, string, url, math, image, file, date)
- `packages/text` — `@hudozka/text` — markdown + typograf rendering
- `pb/` — PocketBase instance (untouched by the monorepo migration)

Common commands (from repo root):

- `npm run dev` — run the web app dev server
- `npm run build` — production build of the web app
- `npm run lint` — lint the whole monorepo
- `npm test` — run tests across every workspace
- `npm run dev -w apps/hudozka-writer` — run the writer
- `npm run migrate -w apps/migrate-to-pocketbase` — run the migration script

## Development

### Prerequisites

- Node.js 24 (see `mise.toml`)

### Getting Started

1. Install dependencies
```bash
npm install
```

2. Start development server
```bash
npm run dev
```

The development server runs at [http://localhost:3000](http://localhost:3000) with Turbo mode enabled.

## Content Management
Content is fetched from PocketBase and rendered using flexible content tokens:
- `text` — Markdown with Russian typography (Typograf)
- `image` — Responsive images with blur hash
- `file` — Document downloads
- `html` — Raw HTML embeds
- `youtube` — Video embeds
- `instagram` — Social media embeds
- `grid` — Card grids

## Accessibility
The site includes an accessibility panel with configurable:
- Font size (8-48pt)
- Color schemes (5 presets: black-on-white, white-on-black, blue-on-blue, brown-on-yellow, green-on-brown)
- Line height and letter spacing
- Image toggling
- Font family (serif/sans-serif)

## Contributors
- Roman Timashev ([roman@tmshv.ru](mailto:roman@tmshv.ru))
