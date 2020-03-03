import { ImageSize, PageCardData } from 'src/types'
import { CardGrid } from '../CardGrid'
import { Card, CardLayout } from '../Card'
import { Date } from './Date'
import { Block } from '../Block'
import { Spacer } from '../Spacer'
import { imageSrcSet } from 'src/lib/image'

export type PageGridProps = {
    items: PageCardData[]
}

export const PageGrid: React.FC<PageGridProps> = props => {
    return (
        <CardGrid
            style={{
                marginBottom: 'var(--size-m)',
            }}
        >
            {props.items.map((item, i) => {
                const gridColumn = item.featured ? 'span 2' : 'auto'
                const layout: CardLayout = item.featured ? 'featured' : 'simple'
                const src = item.coverSrc
                const srcSet = imageSrcSet(item.coverSrc, [ImageSize.large, ImageSize.medium, ImageSize.small])

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
    )
}
