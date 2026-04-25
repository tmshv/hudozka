import cx from "classnames"
import Link from "next/link"
import s from "./styles.module.css"

export type PaginationProps = {
    basePath: string
    page: number
    total: number
    perPage: number
}

type PageEntry = { key: string; value: number | "..." }

function buildPageList(current: number, last: number): PageEntry[] {
    if (last <= 7) {
        return Array.from({ length: last }, (_, i) => ({ key: String(i + 1), value: i + 1 }))
    }
    const pageSet = new Set<number>([1, last, current, current - 1, current + 1])
    const sorted = [...pageSet].filter(n => n >= 1 && n <= last).sort((a, b) => a - b)
    const out: PageEntry[] = []
    for (let i = 0; i < sorted.length; i++) {
        out.push({ key: String(sorted[i]), value: sorted[i] })
        const next = sorted[i + 1]
        if (next !== undefined && next - sorted[i] > 1) {
            out.push({ key: `ellipsis-${sorted[i]}`, value: "..." })
        }
    }
    return out
}

function pageHref(basePath: string, page: number): string {
    return page === 1 ? basePath : `${basePath}?page=${page}`
}

export function Pagination(props: PaginationProps) {
    const last = Math.ceil(props.total / props.perPage)
    if (last <= 1) {
        return null
    }

    const pages = buildPageList(props.page, last)
    const isFirst = props.page <= 1
    const isLast = props.page >= last

    return (
        <nav aria-label="Постраничная навигация">
            <ul className={s.pagination}>
                <li>
                    {isFirst ? (
                        <span className={cx(s.item, s.disabled)}>← Назад</span>
                    ) : (
                        <Link className={s.item} href={pageHref(props.basePath, props.page - 1)}>
                            ← Назад
                        </Link>
                    )}
                </li>
                {pages.map(({ key, value }) => (
                    <li key={key}>
                        {value === "..." ? (
                            <span className={cx(s.item, s.ellipsis)}>…</span>
                        ) : value === props.page ? (
                            <span className={cx(s.item, s.current)} aria-current="page">
                                {value}
                            </span>
                        ) : (
                            <Link className={s.item} href={pageHref(props.basePath, value)}>
                                {value}
                            </Link>
                        )}
                    </li>
                ))}
                <li>
                    {isLast ? (
                        <span className={cx(s.item, s.disabled)}>Вперёд →</span>
                    ) : (
                        <Link className={s.item} href={pageHref(props.basePath, props.page + 1)}>
                            Вперёд →
                        </Link>
                    )}
                </li>
            </ul>
        </nav>
    )
}
