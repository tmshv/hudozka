export function getLayoutFromSize(w: number, h: number, tolerance: number) {
    const r = w / h
    if (r < 1 && r > tolerance) {
        return "square"
    }

    if (w < h) {
        return "vertical"
    }

    return "horizontal"
}
