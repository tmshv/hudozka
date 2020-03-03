import { ImageSize, PageCardData } from 'src/types'
import { CardGrid } from '../CardGrid'
import { Card, CardLayout } from '../Card'
import { Date } from './Date'
import { Block } from '../Block'
import { Spacer } from '../Spacer'
import { imageSrcSet, imageSrc } from 'src/lib/image'
import { Button } from '../Button'
import { useState, useCallback } from 'react'

export type PageGridProps = {
    items: PageCardData[]
}

export const PageGrid: React.FC<PageGridProps> = props => {
    const [page, setPage] = useState(1)
    const i = page * 24
    const items = props.items.slice(0, i)
    const onMore = useCallback(() => {
        setPage(x => x + 1)
    }, [])
    const hasMore = i < props.items.length

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
                    const cover = item.coverSrc ?? process.env.APP_CARD_DEFAULT_IMAGE
                    const src = cover
                    const srcSet = imageSrcSet(src, [ImageSize.large, ImageSize.medium, ImageSize.small])

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
            <Block direction={'horizontal'} style={{
                marginTop: 'var(--size-l)'
            }}>
                <Spacer />
                <Button
                    disabled={!hasMore}
                    onClick={onMore}
                    style={{
                        flex: 2,
                    }}
                >Загрузить ещё</Button>
                <Spacer />
            </Block>
        </>
    )
}
