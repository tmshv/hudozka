import { ArticleCard } from './ArticleCard'
import { Pager } from './Pager'
import { CardGrid } from './CardGrid'
import { IArticle } from 'src/types'

export interface IArticleCardListProps {
    articles: IArticle[]
    nextPage: number | null
    prevPage: number | null
}

export const ArticleCardList: React.FC<IArticleCardListProps> = ({ articles, nextPage, prevPage, ...props }) => (
    <>
        <CardGrid
            style={{
                marginBottom: 'var(--size-m)',
            }}
        >
            {articles.map((article, i) => {
                const preview = {
                    alt: article.title,
                    src: article.preview.src,
                    srcSet: article.preview.set,
                }

                const gridColumn = article.featured ? 'span 2' : 'auto'

                return (
                    <ArticleCard
                        key={i}
                        article={article}
                        preview={preview as any}
                        style={{
                            gridColumn
                        }}
                    />
                )
            })}
        </CardGrid>

        <Pager
            nextHref={nextPage ? `/articles/${nextPage}` : null}
            prevHref={prevPage ? `/articles/${prevPage}` : null}
        />
    </>
)
