import { ArticleCard } from './ArticleCard'
import { Pager } from './Pager'

export interface IArticleCardListProps {
    articles: any[]
    nextPage: number | null
    prevPage: number | null
}

export const ArticleCardList:React.FC<IArticleCardListProps> = ({ articles, nextPage, prevPage }) => (
    <div>
        <style jsx>{`
            .body {
                display: flex;
                flex-direction: row;
                justify-content: center;
                flex-wrap: wrap;
            }
        `}</style>

        <div className={'body'}>
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
        </div>

        <Pager
            nextHref={nextPage ? `/articles/${nextPage}` : null}
            prevHref={prevPage ? `/articles/${prevPage}` : null}
        />
    </div>
)
