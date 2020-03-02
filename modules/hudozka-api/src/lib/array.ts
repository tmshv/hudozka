export function unique<T>(items: T[], key: (item: T) => string): T[]{
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

