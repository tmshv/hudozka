import './styles.css'

import { FileDefinition } from 'src/types'
import { ext, size } from 'src/lib/file'
import { titleCase } from 'src/lib/string'

export const File: React.SFC<FileDefinition> = props => (
    <div className={'file'}>
        <h1>{titleCase(props.name)}</h1>

        {!props.cover?.src ? null : (
            <div className={'file__image'}>
                <a href={props.file.src} target="_blank" className="invisible">
                    <img src={props.cover.src} alt={props.name} />
                </a>
            </div>
        )}

        <div className={'file__file'}>
            <span>{titleCase(props.name)}</span>
        </div>

        <div className={'file__file-info'}>
            <a href={props.file.src} target="_blank">{ext(props.file.name)} ({size(props.file.size)})</a>
        </div>
    </div>
)
