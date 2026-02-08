# [ART.SHLISSELBURG.ORG](https://art.shlisselburg.org)

Website for the Art School of Shlisselburg. Built with Next.js and powered by Strapi CMS.

Font: [«Shadow»](http://mishapanfilov.ru/font_shadow.html)

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
Content is fetched from Strapi CMS and rendered using flexible content tokens:
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
