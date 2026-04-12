export async function download(url: string): Promise<Buffer> {
    const res = await fetch(url)
    if (!res.ok) {
        throw new Error(`download ${url} -> ${res.status}`)
    }
    const buf = await res.arrayBuffer()
    return Buffer.from(buf)
}

export function basenameFromUrl(url: string): string {
    try {
        const u = new URL(url)
        const parts = u.pathname.split("/")
        const last = parts[parts.length - 1]
        return decodeURIComponent(last) || "file"
    } catch {
        return "file"
    }
}
