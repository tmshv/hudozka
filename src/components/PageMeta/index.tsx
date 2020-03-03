import './styles.css'

import { dateFormat } from 'src/lib/date'
import { ITag } from 'src/types'
import { TagList } from '../TagList'

export type PageMetaProps = {
    style?: React.CSSProperties
    date?: Date
    tags?: ITag[]
}

export const PageMeta: React.FC<PageMetaProps> = props => (
    <header className={'pageMeta'} style={props.style}>
        {!props.date ? null : (
            <p className={'date'}>Опубликовано {dateFormat(props.date)}</p>
        )}

        {!(props.tags?.length) ? null : (
            <TagList items={props.tags} />
        )}
    </header>
)
