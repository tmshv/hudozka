import './styles.css'

import { Share } from '../Share'
import { Html } from '../Html'
import { PageMeta } from '../PageMeta'
import { ITag } from 'src/types'

export type PageProps = {
    style?: React.CSSProperties
    date: Date
    tags: ITag[]
}

export const Page: React.FC<PageProps> = props => (
    <div className={'page'} style={props.style}>
        {props.children}
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
