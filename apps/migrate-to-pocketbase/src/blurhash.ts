import sharp from "sharp"

// Tiny jpeg base64 data URL for blur placeholder (matches src/remote/image.ts semantics).
export async function encodeBlur(buffer: Buffer): Promise<string | undefined> {
    try {
        const data = await sharp(buffer)
            .resize(8, 8, { fit: "inside" })
            .jpeg({ quality: 50 })
            .toBuffer()
        return `data:image/jpeg;base64,${data.toString("base64")}`
    } catch (e) {
        console.warn("blur failed:", (e as Error).message)
        return undefined
    }
}

export async function imageDims(buffer: Buffer): Promise<{ width: number, height: number } | undefined> {
    try {
        const meta = await sharp(buffer).metadata()
        if (meta.width && meta.height) {
            return { width: meta.width, height: meta.height }
        }
    } catch (e) {
        console.warn("dims failed:", (e as Error).message)
    }
    return undefined
}
