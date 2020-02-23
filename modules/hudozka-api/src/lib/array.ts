export function unique<T>(items: T[], key: (item: T) => string): T[]{
    const map = new Map(items.map(x => [key(x), x]))

    return [...map.values()]
}
