import PocketBase from "pocketbase"
import { customAlphabet } from "nanoid"

const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 10)
import { readFileSync, writeFileSync, existsSync } from "node:fs"
import type {
    StrapiComponent,
    StrapiMedia,
    StrapiPageCard,
} from "./strapi.ts"
import {
    fetchAllPages,
    fetchHome,
    fetchMenu,
    fetchTags,
} from "./strapi.ts"
import { download, basenameFromUrl } from "./download.ts"
import { encodeBlur, imageDims } from "./blurhash.ts"
import { sha256 } from "./hash.ts"

const STRAPI_URL = process.env.STRAPI_URL ?? "https://hudozka.tmshv.com"
const POCKETBASE_URL = required("POCKETBASE_URL")
const POCKETBASE_EMAIL = required("POCKETBASE_EMAIL")
const POCKETBASE_PASSWORD = required("POCKETBASE_PASSWORD")

const STATE_FILE = new URL("../.migrate-state.json", import.meta.url).pathname
const PHASES = ["tags", "images", "files", "pages", "rewrite", "kv"] as const
type Phase = typeof PHASES[number]

function required(name: string): string {
    const v = process.env[name]
    if (!v) {
        throw new Error(`missing env ${name}`)
    }
    return v
}

// Content blocks written to pages.doc JSON. During pages phase, image/file/page refs
// are strapi numeric ids; rewrite phase remaps them to PB string ids.
type Ref = string | number
type BlockBase = { id: string }
type BlockText = BlockBase & { type: "text", text: string }
type BlockImage = BlockBase & { type: "image", image: Ref, wide: boolean, caption: string }
type BlockDocument = BlockBase & { type: "document", file: Ref, title: string }
type BlockEmbed = BlockBase & { type: "embed", src: string }
type CardRef = { page: Ref, layout: "small" | "medium" | "big" }
type BlockCardGrid = BlockBase & { type: "card-grid", items: CardRef[] }
type Block = BlockText | BlockImage | BlockDocument | BlockEmbed | BlockCardGrid

type DocContent = { version: 1, blocks: Block[] }

type State = {
    tagMap: Record<string, string>,
    imageMap: Record<string, string>,
    fileMap: Record<string, string>,
    pageMap: Record<string, string>,
}

function loadState(): State {
    if (existsSync(STATE_FILE)) {
        const raw = readFileSync(STATE_FILE, "utf-8")
        return JSON.parse(raw) as State
    }
    return { tagMap: {}, imageMap: {}, fileMap: {}, pageMap: {} }
}

function saveState(s: State) {
    writeFileSync(STATE_FILE, JSON.stringify(s, null, 2))
}

function mapFromState(r: Record<string, string>): Map<number, string> {
    const m = new Map<number, string>()
    for (const [k, v] of Object.entries(r)) {
        m.set(Number(k), v)
    }
    return m
}

function mapToState(m: Map<number, string>): Record<string, string> {
    const r: Record<string, string> = {}
    for (const [k, v] of m) {
        r[String(k)] = v
    }
    return r
}

function parsePhases(args: string[]): Phase[] {
    if (args.length === 0) return [...PHASES]
    const unknown = args.filter(a => !PHASES.includes(a as Phase))
    if (unknown.length > 0) {
        console.error(`unknown phase(s): ${unknown.join(", ")}`)
        console.error(`known phases: ${PHASES.join(", ")}`)
        process.exit(1)
    }
    return args as Phase[]
}

async function main() {
    const phases = parsePhases(process.argv.slice(2))
    console.log(`phases: ${phases.join(", ")}`)

    const pb = new PocketBase(POCKETBASE_URL)
    await pb.collection("_superusers").authWithPassword(POCKETBASE_EMAIL, POCKETBASE_PASSWORD)
    console.log("authed to pb")

    const state = loadState()
    const tagMap = mapFromState(state.tagMap)
    const imageMap = mapFromState(state.imageMap)
    const fileMap = mapFromState(state.fileMap)
    const pageMap = mapFromState(state.pageMap)
    console.log(`state: tags=${tagMap.size} images=${imageMap.size} files=${fileMap.size} pages=${pageMap.size}`)

    console.log("\nfetching strapi...")
    const [strapiPages, strapiTags, strapiHome, strapiMenu] = await Promise.all([
        fetchAllPages(STRAPI_URL),
        fetchTags(STRAPI_URL),
        fetchHome(STRAPI_URL),
        fetchMenu(STRAPI_URL),
    ])
    console.log(`strapi: pages=${strapiPages.length} tags=${strapiTags.length} home.cards=${strapiHome.cards.length} menu.items=${strapiMenu.menu.items.length}`)

    // phase: tags
    if (phases.includes("tags")) {
        console.log(`\n[tags] creating ${strapiTags.length}...`)
        let ti = 0
        for (const t of strapiTags) {
            ti++
            const payload = { label: t.name, slug: t.slug }
            try {
                const rec = await pb.collection("tags").create(payload)
                tagMap.set(t.id, rec.id)
                console.log(`  [${ti}/${strapiTags.length}] ${t.slug} -> ${rec.id}`)
            } catch (e) {
                console.error(`  [${ti}/${strapiTags.length}] tag ${t.id} (${t.slug}) failed:`)
                printErr(e, payload)
                throw e
            }
        }
        state.tagMap = mapToState(tagMap)
        saveState(state)
        console.log(`[tags] done: ${tagMap.size}`)
    }

    // phase: images
    if (phases.includes("images")) {
        const imageMedia = new Map<number, StrapiMedia>()
        for (const p of strapiPages) {
            if (p.cover) {
                imageMedia.set(p.cover.id, p.cover)
            }
            for (const c of p.content) {
                if (c.__component === "hudozka.image" && c.media) {
                    imageMedia.set(c.media.id, c.media)
                }
            }
        }
        console.log(`\n[images] uploading ${imageMedia.size}...`)
        const imageHashIndex = await buildHashIndex(pb, "images")
        console.log(`  sha256 index: ${imageHashIndex.size} existing records`)
        let ii = 0
        for (const [sid, m] of imageMedia) {
            ii++
            if (imageMap.has(sid)) {
                console.log(`  [${ii}/${imageMedia.size}] ${m.name} — skip (already uploaded)`)
                continue
            }
            try {
                const buf = await download(m.url)
                const hash = sha256(buf)
                const existingId = imageHashIndex.get(hash)
                if (existingId) {
                    imageMap.set(sid, existingId)
                    console.log(`  [${ii}/${imageMedia.size}] ${m.name} — dedup -> ${existingId}`)
                    continue
                }
                const filename = m.name || basenameFromUrl(m.url)
                const dims = (m.width && m.height)
                    ? { width: m.width, height: m.height }
                    : (await imageDims(buf) ?? { width: 0, height: 0 })
                const blur = await encodeBlur(buf)

                const form = new FormData()
                form.append("file", new Blob([buf], { type: m.mime || "application/octet-stream" }), filename)
                if (m.alternativeText) form.append("alt", m.alternativeText)
                if (m.caption) form.append("caption", m.caption)
                form.append("width", String(dims.width))
                form.append("height", String(dims.height))
                if (blur) {
                    form.append("blurhash", blur)
                } else {
                    console.warn(`    [blur] encode failed or empty`)
                }
                form.append("filename", filename)
                form.append("sha256", hash)

                const rec = await pb.collection("images").create(form)
                imageMap.set(sid, rec.id)
                imageHashIndex.set(hash, rec.id)
                console.log(`  [${ii}/${imageMedia.size}] ${filename} (${dims.width}x${dims.height}, ${Math.round(buf.byteLength / 1024)}KB, blur=${blur ? blur.length + "ch" : "none"}) -> ${rec.id}`)
            } catch (e) {
                console.error(`  [${ii}/${imageMedia.size}] image ${sid} failed:`)
                console.error(`  strapi media:`, JSON.stringify({
                    id: m.id,
                    name: m.name,
                    mime: m.mime,
                    ext: m.ext,
                    sizeKB: m.size,
                    width: m.width,
                    height: m.height,
                    url: m.url,
                }, null, 2))
                printErr(e)
            }
        }
        state.imageMap = mapToState(imageMap)
        saveState(state)
        console.log(`[images] done: ${imageMap.size}/${imageMedia.size}`)
    }

    // phase: files
    if (phases.includes("files")) {
        const docMedia = new Map<number, { id: number, url: string, name: string, mime: string, size: number }>()
        for (const p of strapiPages) {
            for (const c of p.content) {
                if (c.__component === "hudozka.document" && c.media) {
                    docMedia.set(c.media.id, {
                        id: c.media.id,
                        url: c.media.url,
                        name: c.media.name,
                        mime: c.media.mime,
                        size: c.media.size,
                    })
                }
            }
        }
        console.log(`\n[files] uploading ${docMedia.size}...`)
        const fileHashIndex = await buildHashIndex(pb, "files")
        console.log(`  sha256 index: ${fileHashIndex.size} existing records`)
        let fi = 0
        for (const [sid, m] of docMedia) {
            fi++
            if (fileMap.has(sid)) {
                console.log(`  [${fi}/${docMedia.size}] ${m.name} — skip (already uploaded)`)
                continue
            }
            try {
                const buf = await download(m.url)
                const hash = sha256(buf)
                const existingId = fileHashIndex.get(hash)
                if (existingId) {
                    fileMap.set(sid, existingId)
                    console.log(`  [${fi}/${docMedia.size}] ${m.name} — dedup -> ${existingId}`)
                    continue
                }
                const filename = m.name || basenameFromUrl(m.url)
                const bytes = buf.byteLength

                const form = new FormData()
                form.append("file", new Blob([buf], { type: m.mime || "application/octet-stream" }), filename)
                form.append("title", "")
                if (m.mime) form.append("mime", m.mime)
                form.append("size", String(bytes))
                form.append("filename", filename)
                form.append("sha256", hash)

                const rec = await pb.collection("files").create(form)
                fileMap.set(sid, rec.id)
                fileHashIndex.set(hash, rec.id)
                console.log(`  [${fi}/${docMedia.size}] ${filename} (${Math.round(bytes / 1024)}KB) -> ${rec.id}`)
            } catch (e) {
                console.error(`  [${fi}/${docMedia.size}] file ${sid} failed:`)
                printErr(e)
            }
        }
        state.fileMap = mapToState(fileMap)
        saveState(state)
        console.log(`[files] done: ${fileMap.size}/${docMedia.size}`)
    }

    // phase: pages
    if (phases.includes("pages")) {
        console.log(`\n[pages] creating ${strapiPages.length}...`)
        let pi = 0
        for (const p of strapiPages) {
            pi++
            if (pageMap.has(p.id)) {
                console.log(`  [${pi}/${strapiPages.length}] ${p.slug} — skip (already created)`)
                continue
            }
            const blocks = p.content.map(toBlock).filter((b): b is Block => b !== null)
            const doc: DocContent = { version: 1, blocks }
            const coverId = p.cover ? imageMap.get(p.cover.id) : undefined
            const tagIds = p.tags.map(t => tagMap.get(t.id)).filter((x): x is string => !!x)

            const data: Record<string, unknown> = {
                title: p.title,
                slug: p.slug,
                excerpt: p.excerpt ?? "",
                doc,
                tags: tagIds,
                draft: false,
            }
            if (p.date) data.date = p.date
            if (coverId) data.cover = coverId

            try {
                const rec = await pb.collection("pages").create(data)
                pageMap.set(p.id, rec.id)
                console.log(`  [${pi}/${strapiPages.length}] ${p.slug} -> ${rec.id} (${blocks.length} blocks, ${tagIds.length} tags${coverId ? ", cover" : ""})`)
            } catch (e) {
                console.error(`  [${pi}/${strapiPages.length}] page ${p.id} (${p.slug}) failed:`)
                printErr(e)
            }
        }
        state.pageMap = mapToState(pageMap)
        saveState(state)
        console.log(`[pages] done: ${pageMap.size}/${strapiPages.length}`)
    }

    // phase: rewrite. Remaps strapi numeric refs -> PB string ids:
    //   - doc blocks (image/file/card-grid)
    //   - tags relation
    // Drops blocks with unresolved refs. Preserves nanoid block ids.
    if (phases.includes("rewrite")) {
        console.log(`\n[rewrite] remapping refs...`)
        let rewritten = 0
        let dropped = 0
        for (const p of strapiPages) {
            const pbId = pageMap.get(p.id)
            if (!pbId) continue

            try {
                const rec = await pb.collection("pages").getOne(pbId, { fields: "doc" })
                const doc = (rec as unknown as { doc: DocContent }).doc
                const before = doc.blocks.length
                doc.blocks = doc.blocks.map(b => remapBlock(b, imageMap, fileMap, pageMap)).filter((b): b is Block => b !== null)
                dropped += before - doc.blocks.length

                const tagIds = p.tags.map(t => tagMap.get(t.id)).filter((x): x is string => !!x)

                await pb.collection("pages").update(pbId, { doc, tags: tagIds })
                rewritten++
                console.log(`  rewrote ${p.slug} (${doc.blocks.length}/${before} blocks, ${tagIds.length} tags)`)
            } catch (e) {
                console.error(`  rewrite page ${p.id} failed:`)
                printErr(e)
            }
        }
        console.log(`[rewrite] done: ${rewritten} pages, ${dropped} blocks dropped (unresolved refs)`)
    }

    // phase: kv (home + menu)
    if (phases.includes("kv")) {
        console.log(`\n[kv] creating home + menu...`)
        const homeCards = strapiHome.cards
            .map(c => ({ page: pageMap.get(c.page.id), layout: c.layout }))
            .filter((c): c is { page: string, layout: "small" | "medium" | "big" } => !!c.page)

        await pb.collection("kv").create({
            key: "home",
            data: { cards: homeCards },
        })
        console.log(`kv home: ${homeCards.length} cards`)

        const menuItems = strapiMenu.menu.items
            .map(c => ({ page: pageMap.get(c.page.id) }))
            .filter((c): c is { page: string } => !!c.page)

        await pb.collection("kv").create({
            key: "menu",
            data: {
                homeLabel: strapiMenu.homeLabel,
                items: menuItems,
            },
        })
        console.log(`kv menu: homeLabel="${strapiMenu.homeLabel}" items=${menuItems.length}`)
    }

    console.log("\ndone.")
}

// Emit blocks with strapi numeric ids for media/page refs.
// The rewrite phase remaps them to PB string ids.
function toBlock(c: StrapiComponent): Block | null {
    const id = nanoid()
    switch (c.__component) {
    case "hudozka.text":
        return { id, type: "text", text: c.text }
    case "hudozka.image":
        if (!c.media) return null
        return { id, type: "image", image: c.media.id, wide: !!c.wide, caption: c.caption ?? "" }
    case "hudozka.document":
        if (!c.media) return null
        return { id, type: "document", file: c.media.id, title: c.title ?? "" }
    case "hudozka.embed":
        return { id, type: "embed", src: c.src }
    case "hudozka.card-grid": {
        const items: CardRef[] = (c.items ?? [])
            .filter((it: StrapiPageCard) => it && it.page)
            .map((it: StrapiPageCard) => ({ page: it.page.id, layout: it.layout }))
        return { id, type: "card-grid", items }
    }
    default:
        return null
    }
}

// Remap strapi numeric refs -> PB string ids. Returns null if ref unresolved.
// If ref is already a string, pass through (already remapped).
function remapBlock(
    b: Block,
    imageMap: Map<number, string>,
    fileMap: Map<number, string>,
    pageMap: Map<number, string>,
): Block | null {
    switch (b.type) {
    case "image": {
        if (typeof b.image === "string") return b
        const ref = imageMap.get(b.image)
        if (!ref) return null
        return { ...b, image: ref }
    }
    case "document": {
        if (typeof b.file === "string") return b
        const ref = fileMap.get(b.file)
        if (!ref) return null
        return { ...b, file: ref }
    }
    case "card-grid": {
        const items = b.items
            .map(it => {
                if (typeof it.page === "string") return it
                const mapped = pageMap.get(it.page)
                return mapped ? { page: mapped, layout: it.layout } : null
            })
            .filter((x): x is CardRef => x !== null)
        return { ...b, items }
    }
    default:
        return b
    }
}

async function buildHashIndex(pb: PocketBase, collection: string): Promise<Map<string, string>> {
    const idx = new Map<string, string>()
    const recs = await pb.collection(collection).getFullList({ fields: "id,sha256" })
    for (const r of recs) {
        const h = (r as unknown as { sha256?: string }).sha256
        if (h) idx.set(h, r.id)
    }
    return idx
}

function printErr(e: unknown, input?: unknown) {
    const err = e as { message?: string, url?: string, status?: number, response?: { data?: unknown } }
    console.error("ERROR:", err.message)
    if (err.url) console.error("  url:", err.url, "status:", err.status)
    if (input !== undefined) {
        console.error("  input:", JSON.stringify(input, null, 2))
    }
    if (err.response?.data !== undefined) {
        console.error("  response:", JSON.stringify(err.response.data, null, 2))
    }
}

main().catch(e => {
    printErr(e)
    process.exit(1)
})
