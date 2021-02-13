export function asArray<T>(value: T | T[]) {
    return Array.isArray(value)
        ? value
        : [value]
}

export function asItem<T>(value: T | T[]) {
    return Array.isArray(value)
        ? value[0]
        : value
}
