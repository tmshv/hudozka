export function generateBlockId(): string {
    return crypto.randomUUID().slice(0, 8)
}
