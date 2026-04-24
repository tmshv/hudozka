export function queryList(key: string, values: string[]): string {
    if (values.length === 0) {
        return ""
    }

    return values
        .map(value => `${key}=${value}`)
        .join("&")
}
