import s from './styles.module.css'

import cx from 'classnames'
import { ITag } from 'src/types'
import { Button } from '../Button'

const directionClass = {
    horizontal: '',
    vertical: s.vertical,
}

export type Direction = 'horizontal' | 'vertical'

export type TagProps = {
    href: string
    direction: Direction
}

export const Tag: React.FC<TagProps> = props => (
    <li>
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
    <ul className={cx(s.tags, directionClass[props.direction])}>
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
