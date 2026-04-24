import s from "./styles.module.css"

export type CardGridProps = {
    children?: React.ReactNode
    style?: React.CSSProperties
}

export const CardGrid: React.FC<CardGridProps> = ({ children, style }) => {
    return (
        <section className={s.grid} style={style}>
            {children}
        </section>
    )
}
