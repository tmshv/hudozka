import s from './styles.module.css'

import { FileDefinition } from 'src/types'
import { ext, size } from 'src/lib/file'

export type FileProps = FileDefinition & {
    style?: React.CSSProperties
}

export const File: React.SFC<FileProps> = props => (
    <div className={s.file} style={props.style}>
        {!props.cover?.src ? null : (
            <div className={s.image}>
                <a href={props.file.src} target="_blank" className="invisible">
                    <img src={props.cover.src} alt={props.name} />
                </a>
            </div>
        )}

        <div className={s.info}>
            <span>{props.name}</span>
            <a href={props.file.src} target="_blank">
                {ext(props.file.type)} ({size(props.file.size)})
            </a>
        </div>
    </div>
)
