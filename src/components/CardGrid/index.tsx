import s from "./styles.module.css"

export type CardGridProps = {
    style?: React.CSSProperties
}

export const CardGrid: React.FC<CardGridProps> = props => {
    return (
        <section className={s.grid} style={props.style}>
            {props.children}
        </section>
    )
}
