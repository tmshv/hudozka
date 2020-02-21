import './styles.css'

import { ITag } from 'src/types'
import { Button } from '../Button'

export const Tag: React.FC<{ href: string }> = props => (
    <li className={'tagsItem'}>
        <Button href={props.href}>{props.children}</Button>
    </li>
)

export type TagListProps = {
    items: ITag[]
}

export const TagList: React.FC<TagListProps> = props => (
    <ul className={'tags'}>
        {props.items.map(x => (
            <Tag
                key={x.slug}
                href={x.href}
            >
                # {x.name}
            </Tag>
        ))}
    </ul>
)
