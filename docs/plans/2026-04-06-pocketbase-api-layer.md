# PocketBase API Layer Rewrite

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Strapi 3 API layer in `src/remote/` with PocketBase SDK calls, keeping all public function signatures and output types unchanged.

**Architecture:** All PB fetching happens in `api.ts`. Factory functions are pure transforms — they receive resolved PB records and maps, no PB client access. Content blocks use DocV1 format (`{ version: 1, blocks: [...] }`) with block IDs. Image blurhash is pre-computed in PB `images` collection.

**Tech Stack:** PocketBase JS SDK (`pocketbase ^0.25.0`), Next.js App Router (SSG/ISR), TypeScript, Vitest.

**Spec:** `docs/superpowers/specs/2026-04-06-pocketbase-api-layer-design.md`

---

### Task 1: Install PocketBase SDK

**Files:**
- Modify: `package.json`

- [x] **Step 1: Install pocketbase**

```bash
cd /Users/tmshv/Workspace/__github_tmshv/hudozka && npm install pocketbase@^0.25.0
```

- [x] **Step 2: Verify installation**

```bash
cd /Users/tmshv/Workspace/__github_tmshv/hudozka && node -e "import('pocketbase').then(m => console.log('OK', typeof m.default))"
```

Expected: `OK function`

- [x] **Step 3: Commit**

```bash
cd /Users/tmshv/Workspace/__github_tmshv/hudozka && git add package.json package-lock.json && git commit -m "add pocketbase SDK dependency"
```

---

### Task 2: Update app types for string IDs

**Files:**
- Modify: `src/types.ts`

PocketBase uses string IDs (`"2yrq5oqtg7expg0"`), not numeric. `Tag.id` and `PageCardDto.id` must change from `number` to `string`. Only downstream usage is as React `key` — safe change.

- [ ] **Step 1: Update `Tag.id` to string**

In `src/types.ts`, change:

```ts
export type Tag = {
    id: string
    name: string
    slug: string
    href: string
    count: number
}
```

- [ ] **Step 2: Update `PageCardDto.id` to string**

In `src/types.ts`, change:

```ts
export type PageCardDto = {
    id: string
    url: string
    title: string
    featured: boolean
    date: string | null
    cover: Pic
}
```

- [ ] **Step 3: Run lint and tests**

```bash
cd /Users/tmshv/Workspace/__github_tmshv/hudozka && npm run lint && npm test
```

Expected: pass (existing factory.test.ts uses `id: 1` etc — but those tests will be rewritten in Task 5)

- [ ] **Step 4: Commit**

```bash
cd /Users/tmshv/Workspace/__github_tmshv/hudozka && git add src/types.ts && git commit -m "change Tag.id and PageCardDto.id to string for PocketBase"
```

---

### Task 3: Create DocV1 types

**Files:**
- Create: `src/remote/doc.ts`

- [ ] **Step 1: Create `src/remote/doc.ts`**

```ts
export type DocV1BlockText = {
    type: "text"
    id: string
    text: string
}

export type DocV1BlockImage = {
    type: "image"
    id: string
    image: string
    wide: boolean
    caption: string
}

export type DocV1BlockDocument = {
    type: "document"
    id: string
    file: string
    title: string
}

export type DocV1BlockEmbed = {
    type: "embed"
    id: string
    src: string
}

export type DocV1BlockCardGridItem = {
    page: string
    layout: "small" | "medium" | "big"
}

export type DocV1BlockCardGrid = {
    type: "card-grid"
    id: string
    items: DocV1BlockCardGridItem[]
}

export type DocV1Block =
    | DocV1BlockText
    | DocV1BlockImage
    | DocV1BlockDocument
    | DocV1BlockEmbed
    | DocV1BlockCardGrid

export type DocV1 = {
    version: 1
    blocks: DocV1Block[]
}
```

- [ ] **Step 2: Verify no type errors**

```bash
cd /Users/tmshv/Workspace/__github_tmshv/hudozka && npx tsc --noEmit src/remote/doc.ts
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
cd /Users/tmshv/Workspace/__github_tmshv/hudozka && git add src/remote/doc.ts && git commit -m "add DocV1 content block types"
```

---

### Task 4: Create PB client and rewrite types

**Files:**
- Create: `src/remote/pb.ts`
- Rewrite: `src/remote/types.ts`

- [ ] **Step 1: Create `src/remote/pb.ts`**

```ts
import PocketBase from "pocketbase"

const pb = new PocketBase(process.env.POCKETBASE_URL)
pb.autoCancellation(false)

export { pb }
```

- [ ] **Step 2: Rewrite `src/remote/types.ts`**

Replace entire contents with:

```ts
import type { DocV1 } from "./doc"

export type PbRecord = {
    id: string
    collectionId: string
    collectionName: string
    created: string
    updated: string
}

export type PbImage = PbRecord & {
    file: string
    filename: string
    width: number
    height: number
    blurhash: string
    alt: string
    caption: string
}

export type PbFile = PbRecord & {
    file: string
    filename: string
    mime: string
    size: number
    title: string
    preview: string
}

export type PbPage = PbRecord & {
    title: string
    slug: string
    excerpt: string
    date: string
    cover: string
    doc: DocV1
    tags: string[]
    draft: boolean
}

export type PbTag = PbRecord & {
    slug: string
    label: string
}

export type PbKv = PbRecord & {
    key: string
    data: unknown
}

export type PbHomeData = {
    cards: { page: string; layout: "small" | "medium" | "big" }[]
}

export type PbMenuData = {
    homeLabel: string
    items: { page: string }[]
}
```

- [ ] **Step 3: Verify no type errors**

```bash
cd /Users/tmshv/Workspace/__github_tmshv/hudozka && npx tsc --noEmit src/remote/types.ts src/remote/pb.ts
```

Expected: no errors (factory.ts will have errors — expected, fixed in next tasks)

- [ ] **Step 4: Commit**

```bash
cd /Users/tmshv/Workspace/__github_tmshv/hudozka && git add src/remote/pb.ts src/remote/types.ts && git commit -m "add PB client singleton and PB record types"
```

---

### Task 5: Rewrite factory.ts

**Files:**
- Rewrite: `src/remote/factory.ts`

The factory is pure transforms — no PB client, no fetching. It receives resolved records and maps.

- [ ] **Step 1: Write the failing test for `createFeedPages`**

Rewrite `src/remote/factory.test.ts`:

```ts
import { describe, it, expect } from "vitest"
import { createFeedPages } from "./factory"
import type { PbPage } from "./types"

function stubPage(overrides: Partial<PbPage> = {}): PbPage {
    return {
        id: "abc123",
        collectionId: "pbc_1125843985",
        collectionName: "pages",
        created: "2026-01-01T00:00:00.000Z",
        updated: "2026-01-01T00:00:00.000Z",
        title: "Test",
        slug: "/test",
        excerpt: "Excerpt",
        date: "2024-01-15",
        cover: "",
        doc: { version: 1, blocks: [] },
        tags: [],
        draft: false,
        ...overrides,
    }
}

describe("createFeedPages", () => {
    it("should map PB pages to feed pages", () => {
        const pages = [stubPage({ id: "x1", title: "Hello", slug: "/hello", date: "2024-03-01", excerpt: "Summary" })]
        const result = createFeedPages(pages)
        expect(result).toEqual([{
            id: "x1",
            title: "Hello",
            url: "/hello",
            date: "2024-03-01",
            excerpt: "Summary",
        }])
    })

    it("should filter out pages without date", () => {
        const pages = [
            stubPage({ id: "a", date: "2024-01-01" }),
            stubPage({ id: "b", date: "" }),
        ]
        const result = createFeedPages(pages)
        expect(result).toHaveLength(1)
        expect(result[0].id).toBe("a")
    })

    it("should return empty array for empty input", () => {
        expect(createFeedPages([])).toEqual([])
    })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/tmshv/Workspace/__github_tmshv/hudozka && npx vitest run src/remote/factory.test.ts
```

Expected: FAIL (factory.ts still imports old Strapi types)

- [ ] **Step 3: Rewrite `src/remote/factory.ts`**

Replace entire contents with:

```ts
import type { MenuItem, Page, Tag, PageCardDto, Pic, Token, FeedPage } from "@/types"
import type { PbPage, PbImage, PbFile, PbTag, PbHomeData, PbMenuData } from "./types"
import type { DocV1Block } from "./doc"
import { typograf, markdownToHtml } from "@/lib/text"
import { pb } from "./pb"

const md = (text: string) => typograf(markdownToHtml(text))

const DEFAULT_COVER: Pic = {
    src: "/static/img/main.jpg",
    width: 1920,
    height: 1858,
}

function pbFileUrl(collectionId: string, recordId: string, filename: string): string {
    return `${pb.baseURL}/api/files/${collectionId}/${recordId}/${filename}`
}

function imageRecordToPic(image: PbImage, overrides?: { alt?: string; caption?: string }): Pic {
    const pic: Pic = {
        src: pbFileUrl(image.collectionId, image.id, image.file),
        width: image.width,
        height: image.height,
    }

    const alt = overrides?.alt || image.alt || undefined
    if (alt) {
        pic.alt = alt
    }

    const caption = overrides?.caption || image.caption || undefined
    if (caption) {
        pic.caption = caption
    }

    if (image.blurhash) {
        pic.blur = image.blurhash
    }

    return pic
}

function getCoverPic(coverId: string, images: Map<string, PbImage>): Pic {
    if (coverId) {
        const image = images.get(coverId)
        if (image) {
            return imageRecordToPic(image)
        }
    }
    return DEFAULT_COVER
}

export function isYoutubeUrl(url: string): boolean {
    return /youtube\.com/.test(url)
}

export function createEmbed(src: string): Token {
    if (isYoutubeUrl(src)) {
        return {
            token: "youtube",
            data: { url: src },
        }
    }

    return {
        token: "html",
        data: `<iframe src="${src}" width="100%" height="480" frameborder="0"></iframe>`,
    }
}

export function createPageToken(
    block: DocV1Block,
    images: Map<string, PbImage>,
    files: Map<string, PbFile>,
    cardGridPages: Map<string, PbPage>,
    cardGridImages: Map<string, PbImage>,
): Token {
    switch (block.type) {
    case "text":
        return {
            token: "html",
            data: md(block.text),
        }

    case "image": {
        const image = images.get(block.image)
        if (!image) {
            return { token: "text", data: "" }
        }
        return {
            token: "image",
            wide: block.wide,
            data: imageRecordToPic(image, {
                alt: block.caption,
                caption: block.caption,
            }),
        }
    }

    case "document": {
        const file = files.get(block.file)
        if (!file) {
            return { token: "text", data: "" }
        }
        const fileUrl = pbFileUrl(file.collectionId, file.id, file.file)
        return {
            token: "file",
            data: {
                url: fileUrl,
                slug: "",
                image_url: fileUrl,
                file_url: fileUrl,
                title: block.title,
                file_size: file.size,
                file_format: file.mime,
            },
        }
    }

    case "embed":
        return createEmbed(block.src)

    case "card-grid": {
        const items: PageCardDto[] = block.items
            .map(item => {
                const page = cardGridPages.get(item.page)
                if (!page) {
                    return null
                }
                const cover = getCoverPic(page.cover, cardGridImages)
                return {
                    id: page.id,
                    url: page.slug,
                    title: page.title,
                    featured: item.layout === "big" || item.layout === "medium",
                    date: page.date || null,
                    cover,
                }
            })
            .filter((x): x is PageCardDto => x !== null)
        return {
            token: "grid",
            data: { items },
        }
    }

    default:
        return {
            token: "text",
            data: JSON.stringify(block),
        }
    }
}

export function createPage(
    record: PbPage,
    images: Map<string, PbImage>,
    files: Map<string, PbFile>,
    tags: PbTag[],
    cardGridPages: Map<string, PbPage>,
    cardGridImages: Map<string, PbImage>,
): Page {
    const cover = getCoverPic(record.cover, images)

    const pageTags: Tag[] = tags.map(tag => ({
        id: tag.id,
        name: tag.label,
        slug: tag.slug,
        href: `/tags/${tag.slug}`,
        count: 0,
    }))

    const tokens: Token[] = record.doc.blocks.map(block =>
        createPageToken(block, images, files, cardGridPages, cardGridImages),
    )

    return {
        title: record.title,
        description: record.excerpt,
        id: record.id,
        url: record.slug,
        data: "",
        date: "",
        cover,
        tokens: [
            {
                token: "html",
                data: md(`# ${record.title}`),
            },
            ...tokens,
        ],
        tags: pageTags,
        featured: false,
    }
}

export function createHomeCards(
    data: PbHomeData,
    pages: Map<string, PbPage>,
    images: Map<string, PbImage>,
): PageCardDto[] {
    return data.cards
        .map(card => {
            const page = pages.get(card.page)
            if (!page) {
                return null
            }
            const cover = getCoverPic(page.cover, images)
            return {
                id: page.id,
                url: page.slug,
                title: page.title,
                featured: card.layout === "big" || card.layout === "medium",
                date: page.date || null,
                cover,
            }
        })
        .filter((x): x is PageCardDto => x !== null)
}

export function createMenu(
    data: PbMenuData,
    pages: Map<string, PbPage>,
): MenuItem[] {
    const items: MenuItem[] = data.items
        .map(item => {
            const page = pages.get(item.page)
            if (!page) {
                return null
            }
            return {
                href: page.slug,
                name: page.title,
            }
        })
        .filter((x): x is MenuItem => x !== null)

    return [{
        href: "/",
        name: data.homeLabel,
    }, ...items]
}

export function createFeedPages(pages: PbPage[]): FeedPage[] {
    return pages
        .filter(page => page.date)
        .map(page => ({
            id: page.id,
            title: page.title,
            url: page.slug,
            date: page.date,
            excerpt: page.excerpt,
        }))
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd /Users/tmshv/Workspace/__github_tmshv/hudozka && npx vitest run src/remote/factory.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
cd /Users/tmshv/Workspace/__github_tmshv/hudozka && git add src/remote/factory.ts src/remote/factory.test.ts && git commit -m "rewrite factory for PocketBase record types"
```

---

### Task 6: Rewrite api.ts

**Files:**
- Rewrite: `src/remote/api.ts`
- Rewrite: `src/remote/api.test.ts`

- [ ] **Step 1: Rewrite `src/remote/api.ts`**

Replace entire contents with:

```ts
import { pb } from "./pb"
import { createPage, createHomeCards, createMenu, createFeedPages } from "./factory"
import type { PbPage, PbImage, PbFile, PbTag, PbHomeData, PbMenuData } from "./types"
import type { DocV1Block } from "./doc"
import type { MenuItem, Page, PageCardDto, FeedPage } from "@/types"

function buildIdFilter(ids: string[]): string {
    return ids.map(id => `id="${id}"`).join(" || ")
}

async function fetchImagesByIds(ids: string[]): Promise<Map<string, PbImage>> {
    if (ids.length === 0) return new Map()
    const records = await pb.collection("images").getFullList<PbImage>({
        filter: buildIdFilter(ids),
    })
    return new Map(records.map(r => [r.id, r]))
}

async function fetchFilesByIds(ids: string[]): Promise<Map<string, PbFile>> {
    if (ids.length === 0) return new Map()
    const records = await pb.collection("files").getFullList<PbFile>({
        filter: buildIdFilter(ids),
    })
    return new Map(records.map(r => [r.id, r]))
}

async function fetchPagesByIds(ids: string[]): Promise<Map<string, PbPage>> {
    if (ids.length === 0) return new Map()
    const records = await pb.collection("pages").getFullList<PbPage>({
        filter: buildIdFilter(ids),
    })
    return new Map(records.map(r => [r.id, r]))
}

async function fetchTagsByIds(ids: string[]): Promise<PbTag[]> {
    if (ids.length === 0) return []
    return pb.collection("tags").getFullList<PbTag>({
        filter: buildIdFilter(ids),
    })
}

function collectBlockRefs(blocks: DocV1Block[]) {
    const imageIds = new Set<string>()
    const fileIds = new Set<string>()
    const pageIds = new Set<string>()

    for (const block of blocks) {
        switch (block.type) {
        case "image":
            imageIds.add(block.image)
            break
        case "document":
            fileIds.add(block.file)
            break
        case "card-grid":
            for (const item of block.items) {
                pageIds.add(item.page)
            }
            break
        }
    }

    return { imageIds, fileIds, pageIds }
}

export async function getUrls(): Promise<string[]> {
    try {
        const records = await pb.collection("pages").getFullList<PbPage>({
            fields: "slug",
            filter: "draft=false",
        })
        return records.map(r => r.slug)
    } catch (error) {
        console.error(`Failed to fetch URLs: ${error}`)
        return []
    }
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
    try {
        const record = await pb.collection("pages").getFirstListItem<PbPage>(
            `slug="${slug}"`,
        )

        // Collect all referenced IDs from blocks
        const refs = collectBlockRefs(record.doc.blocks)

        // Include cover image ID
        if (record.cover) {
            refs.imageIds.add(record.cover)
        }

        // Round 2: fetch images, files, tags, card-grid pages in parallel
        const [images, files, tags, cardGridPages] = await Promise.all([
            fetchImagesByIds([...refs.imageIds]),
            fetchFilesByIds([...refs.fileIds]),
            fetchTagsByIds(record.tags),
            fetchPagesByIds([...refs.pageIds]),
        ])

        // Round 3: fetch cover images for card-grid pages
        const cardGridCoverIds = new Set<string>()
        for (const page of cardGridPages.values()) {
            if (page.cover && !images.has(page.cover)) {
                cardGridCoverIds.add(page.cover)
            }
        }
        const cardGridImages = cardGridCoverIds.size > 0
            ? await fetchImagesByIds([...cardGridCoverIds])
            : new Map<string, PbImage>()

        // Merge all images for card-grid covers
        const allCardGridImages = new Map([...images, ...cardGridImages])

        return createPage(record, images, files, tags, cardGridPages, allCardGridImages)
    } catch (error) {
        console.error(`Failed to fetch page: ${error}`)
        return null
    }
}

export async function getHomeCards(): Promise<PageCardDto[]> {
    try {
        const kv = await pb.collection("kv").getFirstListItem<{ data: PbHomeData }>(
            "key=\"home\"",
        )
        const data = kv.data
        if (!data.cards || data.cards.length === 0) return []

        const pageIds = data.cards.map(c => c.page)
        const pages = await fetchPagesByIds(pageIds)

        const coverIds = [...pages.values()]
            .map(p => p.cover)
            .filter(Boolean)
        const images = await fetchImagesByIds(coverIds)

        return createHomeCards(data, pages, images)
    } catch (error) {
        console.error(`Failed to fetch home cards: ${error}`)
        return []
    }
}

export async function getMenu(): Promise<MenuItem[]> {
    try {
        const kv = await pb.collection("kv").getFirstListItem<{ data: PbMenuData }>(
            "key=\"menu\"",
        )
        const data = kv.data
        if (!data.items || data.items.length === 0) {
            return [{
                href: "/",
                name: data.homeLabel,
            }]
        }

        const pageIds = data.items.map(i => i.page)
        const pages = await fetchPagesByIds(pageIds)

        return createMenu(data, pages)
    } catch (error) {
        console.error(`Failed to fetch menu: ${error}`)
        return []
    }
}

export async function getRecentPages(limit: number = 30): Promise<FeedPage[]> {
    try {
        const result = await pb.collection("pages").getList<PbPage>(1, limit, {
            filter: "date!='' && draft=false",
            sort: "-date",
        })
        return createFeedPages(result.items)
    } catch (error) {
        console.error(`Failed to fetch recent pages: ${error}`)
        return []
    }
}
```

- [ ] **Step 2: Rewrite `src/remote/api.test.ts`**

Replace entire contents with:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("./pb", () => ({
    pb: {
        baseURL: "http://127.0.0.1:8090",
        collection: vi.fn(),
    },
}))

import { getUrls, getRecentPages } from "./api"
import { pb } from "./pb"

beforeEach(() => {
    vi.restoreAllMocks()
})

describe("getUrls", () => {
    it("should return slugs from all non-draft pages", async () => {
        const mockGetFullList = vi.fn().mockResolvedValue([
            { slug: "/info" },
            { slug: "/2024/test" },
        ])
        vi.mocked(pb.collection).mockReturnValue({
            getFullList: mockGetFullList,
        } as never)

        const result = await getUrls()
        expect(result).toEqual(["/info", "/2024/test"])
        expect(pb.collection).toHaveBeenCalledWith("pages")
        expect(mockGetFullList).toHaveBeenCalledWith({
            fields: "slug",
            filter: "draft=false",
        })
    })

    it("should return empty array on error", async () => {
        vi.mocked(pb.collection).mockReturnValue({
            getFullList: vi.fn().mockRejectedValue(new Error("fail")),
        } as never)
        vi.spyOn(console, "error").mockImplementation(() => {})

        const result = await getUrls()
        expect(result).toEqual([])
    })
})

describe("getRecentPages", () => {
    it("should fetch recent pages with default limit", async () => {
        const mockGetList = vi.fn().mockResolvedValue({
            items: [
                {
                    id: "x1",
                    title: "Recent",
                    slug: "/2024/recent",
                    date: "2024-03-01",
                    excerpt: "Summary",
                    doc: { version: 1, blocks: [] },
                    tags: [],
                    draft: false,
                },
            ],
        })
        vi.mocked(pb.collection).mockReturnValue({
            getList: mockGetList,
        } as never)

        const result = await getRecentPages()
        expect(result).toEqual([{
            id: "x1",
            title: "Recent",
            url: "/2024/recent",
            date: "2024-03-01",
            excerpt: "Summary",
        }])
        expect(mockGetList).toHaveBeenCalledWith(1, 30, {
            filter: "date!='' && draft=false",
            sort: "-date",
        })
    })

    it("should return empty array on error", async () => {
        vi.mocked(pb.collection).mockReturnValue({
            getList: vi.fn().mockRejectedValue(new Error("fail")),
        } as never)
        vi.spyOn(console, "error").mockImplementation(() => {})

        const result = await getRecentPages()
        expect(result).toEqual([])
    })
})
```

- [ ] **Step 3: Run tests**

```bash
cd /Users/tmshv/Workspace/__github_tmshv/hudozka && npx vitest run src/remote/
```

Expected: all tests pass

- [ ] **Step 4: Commit**

```bash
cd /Users/tmshv/Workspace/__github_tmshv/hudozka && git add src/remote/api.ts src/remote/api.test.ts && git commit -m "rewrite api.ts for PocketBase SDK"
```

---

### Task 7: Delete unused files and update config

**Files:**
- Delete: `src/remote/image.ts`
- Delete: `src/remote/lib.ts`
- Modify: `next.config.ts`
- Modify: `.env.example`

- [ ] **Step 1: Delete `src/remote/image.ts` and `src/remote/lib.ts`**

```bash
cd /Users/tmshv/Workspace/__github_tmshv/hudozka && git rm src/remote/image.ts src/remote/lib.ts
```

- [ ] **Step 2: Update `next.config.ts`**

Add `127.0.0.1` to `remotePatterns`:

```ts
import type { NextConfig } from "next"

const config: NextConfig = {
    output: "standalone",
    trailingSlash: false,
    images: {
        remotePatterns: [
            { hostname: "hudozkacdn.tmshv.com" },
            { hostname: "images.weserv.nl" },
            { hostname: "127.0.0.1" },
        ],
    },
}

export default config
```

- [ ] **Step 3: Update `.env.example`**

Add `POCKETBASE_URL`:

```
APP_CARD_DEFAULT_IMAGE=https://art.shlisselburg.org/static/img/main.jpg
NEXT_PUBLIC_YMETRIKA_ACCOUNT=XXX
POCKETBASE_URL=http://127.0.0.1:8090
```

- [ ] **Step 4: Run lint and full test suite**

```bash
cd /Users/tmshv/Workspace/__github_tmshv/hudozka && npm run lint && npm test
```

Expected: all pass

- [ ] **Step 5: Commit**

```bash
cd /Users/tmshv/Workspace/__github_tmshv/hudozka && git add src/remote/image.ts src/remote/lib.ts next.config.ts .env.example && git commit -m "remove unused Strapi files, add PB to config"
```

---

### Task 8: Build verification

**Files:** none (verification only)

- [ ] **Step 1: Create `.env.local` if not exists**

```bash
cd /Users/tmshv/Workspace/__github_tmshv/hudozka && echo 'POCKETBASE_URL=http://127.0.0.1:8090' >> .env.local
```

- [ ] **Step 2: Run build against PB**

```bash
cd /Users/tmshv/Workspace/__github_tmshv/hudozka && npm run build
```

Expected: build succeeds. Pages generate against PocketBase. Some pages may show warnings if card-grid references can't be resolved — that's OK for now.

- [ ] **Step 3: Run full test suite**

```bash
cd /Users/tmshv/Workspace/__github_tmshv/hudozka && npm test
```

Expected: all tests pass

- [ ] **Step 4: Verify lint**

```bash
cd /Users/tmshv/Workspace/__github_tmshv/hudozka && npm run lint
```

Expected: no errors
