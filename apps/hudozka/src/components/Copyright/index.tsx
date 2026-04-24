export type CopyrightProps = {
    years: string
}

export function Copyright({ years }: CopyrightProps) {
    return (
        <span>©&nbsp;{years} Шлиссельбургская детская художественная школа</span>
    )
}
