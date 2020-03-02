import { ImageDefinition, IPage } from 'src/types'
import { Pager } from '../Pager'
import { CardGrid } from '../CardGrid'
import { Card, CardLayout } from '../Card'
import { Date } from './Date'
import { Block } from '../Block'
import { Spacer } from '../Spacer'

export interface IResizeImage {
    w: number
    h: number
}

export function resizeImage(src: string, options: IResizeImage): string {
    return `https://images.weserv.nl/?url=${src}&w=${options.w}&h=${options.h}&n=-1`
}

const cardImgSize1 = { w: 500, h: 500 }
const cardImgSize2 = { w: 1000, h: 1000 }
function getImage(image?: ImageDefinition) {
    if (!image) {
        const defaultSrc = process.env.APP_CARD_DEFAULT_IMAGE
        const src = resizeImage(defaultSrc, cardImgSize1)
        const set = [
            {
                density: 2,
                href: resizeImage(defaultSrc, cardImgSize2),
            }
        ]
        const srcSet = set
            .map(({ href, density }) => `${href} ${density}x`)
            .join(' ')

        return {
            src,
            srcSet,
        }
    }

    const preview = image.artifacts.medium
    const src = preview.src
    const srcSet = preview.set.map(({ url, density }) => `${url} ${density}x`).join(' ')

    return {
        src,
        srcSet,
    }
}

export type PageGridProps = {
    items: IPage[]
    nextPage: number | null
    prevPage: number | null
}

export const PageGrid: React.FC<PageGridProps> = ({ items, nextPage, prevPage, ...props }) => {
    const nextHref = nextPage ? `/articles/${nextPage}` : null
    let prevHref = prevPage ? `/articles/${prevPage}` : null
    if (prevPage === 1) {
        prevHref = '/'
    }

    return (
        <>
            <CardGrid
                style={{
                    marginBottom: 'var(--size-m)',
                }}
            >
                {items.map((item, i) => {
                    const gridColumn = item.featured ? 'span 2' : 'auto'
                    const layout: CardLayout = item.featured ? 'featured' : 'simple'
                    const { src, srcSet } = getImage(item.preview)

                    const content = !item.featured
                        ? (
                            <Block
                                direction={'vertical'}
                            >
                                {item.title}
                                <Spacer />
                                <Date style={{
                                    marginTop: 'var(--size-m)',
                                }}>{item.date}</Date>
                            </Block>
                        ) : (
                            item.title
                        )

                    return (
                        <Card
                            key={i}
                            href={item.url}
                            img={{
                                alt: item.title,
                                src,
                                srcSet,
                            }}
                            layout={layout}
                            style={{
                                gridColumn,
                            }}
                        >
                            {content}
                        </Card>
                    )
                })}
            </CardGrid>

            <Pager
                nextHref={nextHref}
                prevHref={prevHref}
            />
        </>
    )
}
