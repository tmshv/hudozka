import { ImageDefinition, IPage, ImageSize } from 'src/types'
import { Pager } from '../Pager'
import { CardGrid } from '../CardGrid'
import { Card, CardLayout } from '../Card'
import { Date } from './Date'
import { Block } from '../Block'
import { Spacer } from '../Spacer'
import { imageSrcSet } from 'src/lib/image'

function getImage(image?: ImageDefinition) {
    const sizes = [ImageSize.large, ImageSize.medium, ImageSize.small]
    if (!image) {
        const defaultSrc = process.env.APP_CARD_DEFAULT_IMAGE
        return {
            src: defaultSrc,
            srcSet: imageSrcSet(defaultSrc, sizes)
        }
    }

    const src = image.artifacts.large.src
    return {
        src,
        srcSet: imageSrcSet(src, sizes)
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
