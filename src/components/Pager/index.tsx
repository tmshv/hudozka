import './styles.css'

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
    <div className={'pager'}>
        <span className={'pager icon'}>
            {text[i(position)]}
        </span>

        <Link href={url}>
            <a>{linkText[i(position)]}</a>
        </Link>
    </div>
)
