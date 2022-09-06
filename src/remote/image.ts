import sharp from "sharp"

async function fetchBuffer(url: string) {
    try {
        const res = await fetch(url)
        if (!res.ok) {
            return undefined
        }
        const data = await res.arrayBuffer()
        return Buffer.from(data)
    } catch (error) {
        return undefined
    }
}

export async function encodeImageToBlurhash(url: string) {
    const buffer = await fetchBuffer(url)
    if (!buffer) {
        return undefined
    }

    const t = sharp(buffer)
        .raw()
        .resize(8, 8, { fit: "inside" })
        .toFormat("jpeg")

    const { data } = await t.toBuffer({ resolveWithObject: true })

    return `data:image/jpeg;base64,${data.toString("base64")}`
}
