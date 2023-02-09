export type InsertBetweenFunction<T> = (i: number) => T

export function insertBetween<T, I = T>(items: T[], fn: InsertBetweenFunction<I>): Array<T | I> {
    return items.reduce<Array<T | I>>((acc, x, i) => {
        acc.push(x)

        if (i < items.length - 1) {
            acc.push(fn(i))
        }

        return acc
    }, [])
}

export function tail<T>(items: T[]): T[] {
    const [_, ...rest] = items
    return rest
}

