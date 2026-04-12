# PocketBase Migration Plan

Based on verified live data from `hudozka.tmshv.com`.

## Verified Data Volume

| Entity     | Count |
|------------|-------|
| Pages      | 316   |
| Tags       | 70    |
| Home cards | 17    |
| Menu items | 4     |

---

## Part 1: PocketBase Setup (manual)

See [20260403-pocketbase-setup-guide.md](20260403-pocketbase-setup-guide.md).

---

## Part 2: Migration Script

Script location: `modules/migrate-to-pocketbase/`

### What it does

1. Fetches all data from Strapi (`hudozka.tmshv.com`):
   - `GET /pages?_limit=100&_start={n}` (4 batches)
   - `GET /tags`
   - `GET /home`
   - `GET /menu`

2. Creates 70 tag records in PocketBase, builds `strapiTagId -> pbTagId` map.

3. Collects all unique Strapi media used as images (covers + `hudozka.image` blocks). For each:
   - Downloads file from `hudozkacdn.tmshv.com`
   - Reads dimensions with `sharp`, computes blurhash
   - Creates `images` record with `file, alt, caption, width, height, blur, filename`
   - Builds `strapiMediaId -> pbImageId` map

4. Collects all unique Strapi media used as documents (`hudozka.document` blocks). For each:
   - Downloads file from `hudozkacdn.tmshv.com`
   - Creates `files` record with `file, title, mime, size, filename` (preview left empty)
   - Builds `strapiMediaId -> pbFileId` map

5. For each of 316 pages:
   - Resolves `cover` to `pbImageId` via image map
   - Converts `content[]` from Strapi component format to simplified JSON blocks:
     - `hudozka.text`      -> `{ type: "text", text }`
     - `hudozka.image`     -> `{ type: "image", image: pbImageId, wide, caption }`
     - `hudozka.document`  -> `{ type: "document", file: pbFileId, title }`
     - `hudozka.embed`     -> `{ type: "embed", src }`
     - `hudozka.card-grid` -> `{ type: "card-grid", items: [{ page: strapiPageId, layout }] }`
   - Creates page record with `cover` + `tags` relations + `content` JSON

6. Second pass: replaces Strapi page IDs in `card-grid` blocks with PocketBase page IDs.

7. Creates 2 `kv` records:
   - `key: "home"` with card list (PocketBase page IDs + layouts)
   - `key: "menu"` with menu items (PocketBase page IDs) + `homeLabel`

8. Verification: counts check, spot-check, HTTP HEAD on file URLs.

### Environment

Requires `STRAPI_URL` (default `https://hudozka.tmshv.com`) and `POCKETBASE_URL` + `POCKETBASE_EMAIL` + `POCKETBASE_PASSWORD` env vars.

---

## Part 3: App Changes

Only `src/remote/` changes. `src/types.ts` stays **unchanged**.

### New file: `src/remote/pb.ts`

PocketBase client singleton. Reads `POCKETBASE_URL` from env.

### Rewrite: `src/remote/types.ts`

Replace `Strapi*` types with `Pb*` types matching PocketBase record shape + new content block types.

### Rewrite: `src/remote/api.ts`

Same exported function signatures, PocketBase SDK calls instead of raw fetch:

| Function             | Current                                        | New (PocketBase SDK)                                                          |
|----------------------|------------------------------------------------|-------------------------------------------------------------------------------|
| `getUrls()`          | `GET /pages?_limit=100&_start={n}`             | `pb.collection("pages").getFullList({ fields: "slug" })`                      |
| `getPageBySlug(slug)`| `GET /pages?slug={slug}`                       | `pb.collection("pages").getFirstListItem('slug="..."', { expand: "cover,tags" })` + resolve image/file IDs from content via prefetched maps |
| `getHomeCards()`     | `GET /home`                                    | `pb.collection("kv").getFirstListItem('key="home"')` + fetch pages            |
| `getMenu()`          | `GET /menu`                                    | `pb.collection("kv").getFirstListItem('key="menu"')` + fetch pages            |
| `getRecentPages(n)`  | `GET /pages?_sort=date:DESC&_limit={n}`        | `pb.collection("pages").getList(1, n, { filter: "date!=''", sort: "-date" })` |

### Rewrite: `src/remote/factory.ts`

Transform functions accept PocketBase records, output identical app types. Key changes:
- At build start, prefetch all `images` and `files` records once → in-memory `Map<id, record>`
- Content blocks reference image/file IDs; resolved via the maps (no per-page expand)
- Pages fetched with `expand: "cover,tags"` only
- File URLs via `pb.files.getURL(record, record.file)`
- Blurhash read from image record (`blur` field) — no runtime `sharp` calls needed
- `content` is already clean JSON (no `__component` prefix)
- `asItem()` from `lib.ts` no longer needed
- `createPicFromMedia()` -> `createPicFromImageRecord(imageRecord)`
- Text processing (`markdownToHtml` + `typograf`) stays identical

### Update: `next.config.ts`

Add PocketBase host to `images.remotePatterns`.

### New dependency

`pocketbase` (JS SDK)

### Files summary

| File                  | Action                                    |
|-----------------------|-------------------------------------------|
| `src/remote/pb.ts`    | **New** — PocketBase client               |
| `src/remote/types.ts` | **Rewrite** — `Pb*` types                 |
| `src/remote/api.ts`   | **Rewrite** — PocketBase SDK calls        |
| `src/remote/factory.ts`| **Rewrite** — new input shapes           |
| `src/remote/image.ts` | **Remove** — blurhash precomputed in migration |
| `src/remote/lib.ts`   | **Remove or simplify**                    |
| `src/types.ts`        | **No changes**                            |
| `next.config.ts`      | **Update** — remotePatterns               |
| `.env.example`        | **Update** — add `POCKETBASE_URL`         |
| `package.json`        | **Update** — add `pocketbase` dependency  |
