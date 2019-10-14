import * as React from 'react'
import { ext, size } from '../../lib/file'
import { titleCase } from '../../lib/string'

export interface IDocumentListItemProps {
    title: string
    url: string
    imageUrl: string
    fileUrl: string
    fileName: string
    fileSize: number
}

export const DocumentListItem: React.FC<IDocumentListItemProps> = props => (
    <div className="document-row">
        <a href={props.url} className="invisible">
            <div className="document-row__image">
                <img src={props.imageUrl} alt={props.title} />
            </div>
        </a>

        <div className="document-row__file">
            <a href={props.url}>{titleCase(props.title)}</a>
        </div>

        <div className="document-row__file-info">
            <a href={props.fileUrl} target="_blank">{ext(props.fileName)} ({size(props.fileSize)})</a>
        </div>
    </div>
)
