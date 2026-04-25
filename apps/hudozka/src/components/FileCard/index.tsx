import { Box } from "@hudozka/ui"
import { ext, getResizedUrl, size } from "@hudozka/utils"
import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import type { FileTokenData, Sign } from "@/types"
import s from "./filecard.module.css"

const Signature = dynamic(() => import("./Signature").then(m => ({ default: m.Signature })), {
    ssr: false,
})

export type FileCardProps = FileTokenData & {
    sign?: Sign
}

export const FileCard: React.FC<FileCardProps> = props => {
    const fileSize = props.file_size != null ? size(props.file_size) : ""
    const format = ext(props.file_format)

    return (
        <div className={s.file}>
            <a href={props.url} className="invisible">
                <div className={s.image}>
                    <Image
                        className={s.image}
                        loader={({ src, width }) => {
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
                    {!props.sign ? null : <Signature {...props.sign} />}
                    <Link href={props.url}>{props.title}</Link>
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
