import sharp from "sharp"

export async function encodeImageToBlurhash(url: string) {
    const res = await fetch(url)
    if (!res.ok) {
        return undefined
    }

    const data = await res.arrayBuffer()
    const buffer = Buffer.from(data)

    const t = sharp(buffer)
        .raw()
        .resize(8, 8, { fit: "inside" })
        .toFormat('jpeg')

    const { data } = await t.toBuffer({ resolveWithObject: true })

    return `data:image/jpeg;base64,${data.toString('base64')}`
}
