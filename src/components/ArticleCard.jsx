import React from 'react'
import { Image } from './Image'
import { dateFormat } from '../lib/date'

const Date = ({ children }) => (
    <p className="date">{dateFormat(children)}</p>
)

const ArticleCard = ({ article }) => (
    <article className="ArticleCard">
        <style jsx>{`
            .ArticleCard {
                --article-card-width: 30%;
                --article-card-image-height: 15em;
                --article-card-margin: var(--double-margin) var(--single-margin);

                display: flex;
                flex-direction: column;

                margin: var(--article-card-margin);
                width: var(--article-card-width);
                min-width: 10em;
                max-width: 30em;

                border-radius: 10px;

                box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
                overflow: hidden;
            }

            .ArticleCard > a {
                    display: block;
                    position: relative;
                //  height: 100%;
            }

            .ArticleCard-image {
                overflow: hidden;
                border-radius: 2px 2px 0 0;

                width: 100%;
                height: var(--article-card-image-height);
            }

            .ArticleCard-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;

                transition: transform 150ms ease-out;
            }

            .ArticleCard-body {
                z-index: 1000;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: flex-start;

                height: 5em;

                padding: .75em 1em;
            }

            .ArticleCard .date {
                color: #ccc;
                font-size: small;
            }

            .ArticleCard:hover img {
                transform: scale(1.05);
            }

            // Tablet

            @media screen and (min-width: var(--tablet-min-width)) and (max-width: var(--tablet-max-width)) {
                .ArticleCard {
                    --article-card-image-height: 12em;
                }

                @media screen and (orientation: portrait) {
                }
            }


            // Mobile

            @media (max-width: var(--mobile-width)) {
                .ArticleCard {
                    --article-card-width: 100%;
                    --article-card-margin: var(--single-margin) 0;
                }
            }
        `}</style>

        <a className="invisible" href={article.url}>
            <div className="ArticleCard-image">
                {!article.preview ? null : (
                    <Image
                        data={article.preview}
                        alt={article.title}
                        opa={false}
                    />
                )}
            </div>

            <div className="ArticleCard-body">
                {article.title}

                {!article.date ? null : (
                    <Date>{article.date}</Date>
                )}
            </div>
        </a>
    </article>
)

module.exports = ArticleCard
