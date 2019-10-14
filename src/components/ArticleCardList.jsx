import React from 'react'
import Paginator from './Paginator'
import { ArticleCard } from './ArticleCard'

export const ArticleCardList = ({ articles, nextPage, prevPage }) => (
    <div>
        <style jsx>{`
            .body {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
            }
        `}</style>

        {!prevPage ? null : (
            <Paginator url={`/articles/${prevPage}`} type="top" />
        )}

        <div className={'body'}>
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
