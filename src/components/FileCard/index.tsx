import s from "./filecard.module.css"

import Image from "next/image"
import dynamic from "next/dynamic"
import { FileTokenData, Sign } from "@/types"
import { size, ext } from "@/lib/file"
import { getResizedUrl } from "@/lib/image"
import Link from "next/link"
import { Box } from "@/ui/Box"

const Signature = dynamic(import("./Signature").then(m => m.Signature), {
    ssr: false,
})

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
                                width,
                                height: width,
                                n: 1,
                            })
                        }}
                        src={props.image_url}
                        alt={""}
                        width={100}
                        height={100}
                    />
                </div>
            </a>

            <div>
                <Box align={false} gap={"var(--size-xs)"}>
                    {!props.sign ? null : (
                        <Signature
                            {...props.sign}
                        />
                    )}
                    <Link href={props.url}>
                        {props.title}
                    </Link>
                </Box>
            </div>

            <div className={s.info}>
                <Link href={props.file_url} target="_blank" rel="noreferrer">
                    {format} ({fileSize})
                </Link>
            </div>
        </div>
    )
}
