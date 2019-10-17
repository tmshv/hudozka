import * as React from 'react'
import { IDocument } from '../../types'
import { DocumentListItem } from '../DocumentListItem'

export interface IDocumentListProps {
    documents: IDocument[]
    name: string
}

export const DocumentList: React.FC<IDocumentListProps> = props => (
    <div className="documents-container">
        <div className="documents-container__head">
            <h2>{props.name}</h2>
        </div>

        <div className="documents-container__body">
            {props.documents.map((d, i) => (
                <DocumentListItem key={i} {...d} />
            ))}
        </div>
    </div>
)
