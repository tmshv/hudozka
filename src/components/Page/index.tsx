import './styles.css'

import { Share } from '../Share'
import { Html } from '../Html'
import { PageMeta } from '../PageMeta'
import { ITag } from 'src/types'

export type PageProps = {
    style?: React.CSSProperties
    children: string
    date: Date
    tags: ITag[]
}

export const Page: React.FC<PageProps> = props => (
    <div className={'page'} style={props.style}>
        <Html
            as={'article'}
            className={'article'}
            html={props.children}
        />

        <hr />
        <Share />

        <PageMeta
            style={{
                marginTop: 'var(--size-m)',
            }}
            date={props.date}
            tags={props.tags}
        />
    </div>
)
