import { ArticleCard } from './ArticleCard'
import { Pager } from './Pager'
import { CardGrid } from './CardGrid'

export interface IArticleCardListProps {
    articles: any[]
    nextPage: number | null
    prevPage: number | null
}

export const ArticleCardList: React.FC<IArticleCardListProps> = ({ articles, nextPage, prevPage }) => (
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

                return (
                    <ArticleCard
                        key={i}
                        article={article}
                        preview={preview}
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
