import React from 'react'
import Paginator from './Paginator'
import { ArticleCard } from './ArticleCard'

export const ArticleCardList = ({ articles, nextPage, prevPage }) => (
    <div className="ArticleCardList">
        {!prevPage ? null : (
            <Paginator url={`/articles/${prevPage}`} type="top" />
        )}

        <div className="ArticleCardList-body">
            {articles.map((article, i) => (
                <ArticleCard
                    key={i}
                    article={article}
                />
            ))}
        </div>

        {!nextPage ? null : (
            <Paginator url={`/articles/${nextPage}`} type="bottom" />
        )}
    </div>
)
