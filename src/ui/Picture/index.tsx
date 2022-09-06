import s from "./picture.module.css"

import { memo } from "react"
import Image from "next/image"
import classnames from "classnames/bind"
import { getLayoutFromSize } from "./lib"

const cx = classnames.bind(s)

export type PictureProps = {
    style?: React.CSSProperties
    src: string
    alt?: string
    width: number
    height: number
    caption?: React.ReactNode
    blur?: string
    wide?: boolean
    layoutTolerance?: number
}

export const Picture: React.FC<PictureProps> = memo(({
    wide: userWide = false,
    layoutTolerance = 0.95,
    style,
    src,
    alt,
    width,
    height,
    caption,
    blur,
}) => {
    const layout = getLayoutFromSize(width, height, layoutTolerance)
    const wide = layout === "horizontal" ? userWide : false

    return (
        <figure className={cx(s.pic, layout, { wide })} style={style}>
            <Image
                className={s.img}
                src={src}
                alt={alt}
                width={width}
                height={height}
                layout={"responsive"}
                blurDataURL={blur}
                placeholder={blur ? "blur" : "empty"}
            />
            {!caption ? null : (
                <figcaption>{caption}</figcaption>
            )}
        </figure>
    )
})

Picture.displayName = "Picture"
