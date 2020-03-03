import './styles.css'

import cx from 'classnames'
import { ITag } from 'src/types'
import { Button } from '../Button'

export type Direction = 'horizontal' | 'vertical'

export type TagProps = {
    href: string
    direction: Direction
}

export const Tag: React.FC<TagProps> = props => (
    <li className={cx('tagsItem', props.direction)}>
        <Button
            href={props.href}
            size={'small'}
            disabled={true}
        >
            {props.children}
        </Button>
    </li>
)

export type TagListProps = {
    items: ITag[]
    direction: Direction
}

export const TagList: React.FC<TagListProps> = props => (
    <ul className={cx('tags', props.direction)}>
        {props.items.map(x => (
            <Tag
                key={x.slug}
                href={x.href}
                direction={props.direction}
            >
                {x.name}
            </Tag>
        ))}
    </ul>
)
