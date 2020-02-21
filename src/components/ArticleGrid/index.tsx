import { IArticle } from 'src/types'
import { Pager } from '../Pager'
import { CardGrid } from '../CardGrid'
import { Card, CardLayout } from '../Card'
import { Date } from './Date'
import { Block } from '../Block'
import { Spacer } from '../Spacer'

export type ArticleGridProps = {
    articles: IArticle[]
    nextPage: number | null
    prevPage: number | null
}

export const ArticleGrid: React.FC<ArticleGridProps> = ({ articles, nextPage, prevPage, ...props }) => (
    <>
        <CardGrid
            style={{
                marginBottom: 'var(--size-m)',
            }}
        >
            {articles.map((article, i) => {
                const gridColumn = article.featured ? 'span 2' : 'auto'
                const layout: CardLayout = article.featured ? 'featured' : 'simple'
                const srcSet = article.preview.set.map(({ url, density }) => `${url} ${density}x`).join(' ')

                const content = article.featured
                    ? (
                        <h2 style={{
                            margin: 0,
                            fontSize: '18pt'
                        }}>
                            {article.title}
                        </h2>
                    ) : (
                        <Block
                            direction={'vertical'}
                        >
                            {article.title}
                            <Spacer />
                            <Date style={{
                                marginTop: 'var(--size-m)',
                            }}>{article.date}</Date>
                        </Block>
                    )

                return (
                    <Card
                        key={i}
                        href={article.url}
                        img={{
                            alt: article.title,
                            src: article.preview.src,
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
            nextHref={nextPage ? `/articles/${nextPage}` : null}
            prevHref={prevPage ? `/articles/${prevPage}` : null}
        />
    </>
)
