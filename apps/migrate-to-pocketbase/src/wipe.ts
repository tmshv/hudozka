import PocketBase from "pocketbase"
import { existsSync, readFileSync, writeFileSync } from "node:fs"

const STATE_FILE = new URL("../.migrate-state.json", import.meta.url).pathname
const POCKETBASE_URL = required("POCKETBASE_URL")
const POCKETBASE_EMAIL = required("POCKETBASE_EMAIL")
const POCKETBASE_PASSWORD = required("POCKETBASE_PASSWORD")

const KNOWN = ["tags", "images", "files", "pages", "kv"] as const

function required(name: string): string {
    const v = process.env[name]
    if (!v) {
        throw new Error(`missing env ${name}`)
    }
    return v
}

async function wipe(pb: PocketBase, collection: string) {
    console.log(`\n[${collection}] wiping...`)
    let total = 0
    while (true) {
        const batch = await pb.collection(collection).getList(1, 200, { fields: "id" })
        if (batch.items.length === 0) {
            break
        }
        for (const rec of batch.items) {
            await pb.collection(collection).delete(rec.id)
            total++
            if (total % 20 === 0) {
                console.log(`  [${collection}] deleted ${total}...`)
            }
        }
    }
    console.log(`[${collection}] done: ${total} deleted`)
}

async function main() {
    const args = process.argv.slice(2)
    const targets = args.length > 0 ? args : [...KNOWN]

    const unknown = targets.filter(t => !KNOWN.includes(t as typeof KNOWN[number]))
    if (unknown.length > 0) {
        console.error(`unknown collections: ${unknown.join(", ")}`)
        console.error(`known: ${KNOWN.join(", ")}`)
        process.exit(1)
    }

    const pb = new PocketBase(POCKETBASE_URL)
    await pb.collection("_superusers").authWithPassword(POCKETBASE_EMAIL, POCKETBASE_PASSWORD)
    console.log("authed to pb")
    console.log(`wiping: ${targets.join(", ")}`)

    // Wipe pages first (references images/files/tags), then kv, then images/files/tags.
    const order = ["pages", "kv", "images", "files", "tags"]
    for (const c of order) {
        if (targets.includes(c)) {
            await wipe(pb, c)
        }
    }

    // Sync state file: drop map for each wiped collection
    if (existsSync(STATE_FILE)) {
        const state = JSON.parse(readFileSync(STATE_FILE, "utf-8")) as Record<string, Record<string, string>>
        const keyFor: Record<string, string> = {
            tags: "tagMap",
            images: "imageMap",
            files: "fileMap",
            pages: "pageMap",
        }
        for (const t of targets) {
            const key = keyFor[t]
            if (key) state[key] = {}
        }
        writeFileSync(STATE_FILE, JSON.stringify(state, null, 2))
        console.log("\nstate file updated")
    }

    console.log("\ndone.")
}

main().catch(e => {
    const err = e as { message?: string, url?: string, status?: number, response?: { data?: unknown } }
    console.error("ERROR:", err.message)
    if (err.url) console.error("  url:", err.url, "status:", err.status)
    if (err.response?.data !== undefined) {
        console.error("  response:", JSON.stringify(err.response.data, null, 2))
    }
    process.exit(1)
})
