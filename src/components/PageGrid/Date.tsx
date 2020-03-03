import { dateFormat } from 'src/lib/date'

export type DateProps = {
    style?: React.CSSProperties
    children: string | Date
}
export const Date: React.FC<DateProps> = props => (
    <p style={props.style}>
        <style jsx>{`
            p {
                color: var(--color-text-second);
                font-size: var(--font-size-second);
            }
        `}</style>
        {dateFormat(props.children)}
    </p>
)
