import Link from 'next/link'

const text = ['↑', '↓']
const linkText = ['Предыдущая страница', 'Следующая страница']

type Position = 'top' | 'bottom'
const i = (type: Position) => type === 'top'
    ? 0
    : 1

export type PagerProps = {
    url: string
    position: Position
}

export const Pager: React.FC<PagerProps> = ({ url, position }) => (
    <div>
        <style jsx>{`
            div {
                text-align: center;
                margin-top: var(--size-m);
                margin-bottom: var(--size-m);
            }

            span {
                margin: 0 var(--size-s);
            }
        `}</style>

        <span>
            {text[i(position)]}
        </span>

        <Link href={url}>
            <a>{linkText[i(position)]}</a>
        </Link>
    </div>
)
