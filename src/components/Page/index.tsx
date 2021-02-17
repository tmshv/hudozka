import s from './styles.module.css'

import { Share } from '../Share'
import { PageMeta } from '../PageMeta'
import { ITag } from 'src/types'

export type PageProps = {
    style?: React.CSSProperties
    date?: Date
    tags: ITag[]
}

export const Page: React.FC<PageProps> = props => (
    <div className={s.page} style={props.style}>
        {props.children}
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
