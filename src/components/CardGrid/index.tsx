import './styles.css'

export type CardGridProps = {
    style?: React.CSSProperties
}

export const CardGrid: React.FC<CardGridProps> = props => {
    return (
        <section className={'card-grid'} style={props.style}>
            {props.children}
        </section>
    )
}
