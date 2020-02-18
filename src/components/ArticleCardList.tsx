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

        {!prevPage ? null : (
            <Pager url={`/articles/${prevPage}`} position={'top'} />
        )}

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

        {!nextPage ? null : (
            <Pager url={`/articles/${nextPage}`} position={'bottom'} />
        )}
    </div>
)
