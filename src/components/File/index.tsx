import s from "./styles.module.css"

import type { FileDefinition } from "@/types"
import { ext, size } from "src/lib/file"
import Link from "next/link"
import Image from "next/image"

export type FileProps = FileDefinition & {
    style?: React.CSSProperties
}

export const File: React.FC<FileProps> = props => (
    <div className={s.file} style={props.style}>
        {!props.cover?.src ? null : (
            <div className={s.image}>
                <Link href={props.file.src} target="_blank" rel="noreferrer" className="invisible">
                    <Image
                        src={props.cover.src}
                        alt={props.name}
                    />
                </Link>
            </div>
        )}

        <div className={s.info}>
            <span>{props.name}</span>
            <Link href={props.file.src} target={"_blank"} rel={"noreferrer"}>
                {ext(props.file.type)} ({size(props.file.size)})
            </Link>
        </div>
    </div>
)
