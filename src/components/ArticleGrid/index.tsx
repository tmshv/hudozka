import { Pager } from '../Pager'
import { CardGrid } from '../CardGrid'
import { IArticle } from 'src/types'
import { Card, CardLayout } from '../Card'
import { Date } from './Date'

export interface IArticleGridProps {
    articles: IArticle[]
    nextPage: number | null
    prevPage: number | null
}

export const ArticleGrid: React.FC<IArticleGridProps> = ({ articles, nextPage, prevPage, ...props }) => (
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
                        <div style={{
                            minHeight: '5em',
                        }}>
                            <h2 style={{
                                // margin: '0 0 var(--size-s)',
                                margin: 0,
                                fontSize: '18pt'
                            }}>
                                {article.title}
                            </h2>

                            {/* <Date>{article.date}</Date> */}
                        </div>
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
