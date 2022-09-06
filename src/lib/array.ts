export function splitBy(fn) {
    return items => {
        return items.reduce((acc, item) => {
            const key = fn(item)
            const items = acc.get(key) || []

            return acc.set(key, [...items, item])
        }, new Map())
    }
}

export function insertBetween<T, I = T>(items: T[], fn: (i: number) => I): Array<T | I> {
    return items.reduce<Array<T | I>>((acc, x, i) => {
        acc.push(x)

        if (i < items.length - 1) {
            acc.push(fn(i))
        }

        return acc
    }, [])
}
