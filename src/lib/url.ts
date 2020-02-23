export function isPartOfPath(part: string, path: string): boolean {
    return path.startsWith(part)
}
