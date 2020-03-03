export function unique<T>(items: T[], key: (item: T) => string): T[] {
    const map = new Map(items.map(x => [key(x), x]))

    return [...map.values()]
}

export function ensureArray<T>(value: T | T[]): T[] {
    if (!value) {
        return []
    }

    if (Array.isArray(value)) {
        return value
    }

    return [value]
}

/**
 * 
 * Check if array has one item at least
 * 
 * @param items 
 */
export function isArrayOk<T>(items: T[]): boolean {
    if (!Array.isArray(items)) {
        return false
    }

    return items.length > 0
}
