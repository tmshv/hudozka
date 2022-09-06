
export function insertBetween<T, I = T>(items: T[], fn: (i: number) => I): Array<T | I> {
    return items.reduce<Array<T | I>>((acc, x, i) => {
        acc.push(x)

        if (i < items.length - 1) {
            acc.push(fn(i))
        }

        return acc
    }, [])
}
