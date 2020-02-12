import * as React from 'react'
import { dateFormat } from '../../lib/date'

export interface IPageHeaderProps {
    tags?: string[]
    date?: Date
    title: string
}

export const PageHeader: React.FC<IPageHeaderProps> = props => (
    <header className="Article-Head">
        <h1>{props.title}</h1>

        {!props.date ? null : (
            <p className="date">{dateFormat(props.date)}</p>
        )}

        {/* {!(tags.length) ? null : (
            <TagList tags={tags} />
        )} */}
    </header>
)
