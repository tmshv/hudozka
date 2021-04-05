import s from './filecard.module.css'

import Image from 'next/image'
import { FileTokenData, Sign } from '@/types'
import { size, ext } from '@/lib/file'
import { getResizedUrl } from '@/lib/image'
import { Signature } from './Signature'

export type FileCardProps = FileTokenData & {
    sign?: Sign
}

export const FileCard: React.FC<FileCardProps> = props => {
    const fileSize = size(props.file_size)
    const format = ext(props.file_format)

    return (
        <div className={s.file}>
            <a href={props.url} className="invisible">
                <div className={s.image}>
                    <Image
                        className={s.image}
                        loader={({ src, width, quality }) => {
                            return getResizedUrl(src, {
                                width: 200,
                                height: 200,
                                n: 1,
                            })
                        }}
                        src={props.image_url}
                        width={100}
                        height={100}
                        objectFit={'contain'}
                    />
                </div>
            </a>

            <div className={s.name}>
                <span style={{
                    display: 'flex',
                }}>
                    {!props.sign ? null : (
                        <Signature
                            {...props.sign}
                        />
                    )}
                    <a href={props.url}>{props.title}</a>
                </span>
            </div>

            <div className={s.info}>
                <a href={props.file_url} target="_blank">
                    {format} ({fileSize})
                </a>
            </div>
        </div>
    )
}
