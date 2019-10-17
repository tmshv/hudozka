import React from 'react'
import cx from 'classnames'
import { dateFormat } from '../../lib/date'

const Date = ({ children }) => (
    <p className="date">{dateFormat(children)}</p>
)

interface IImage {
    alt: string
    src: string
    srcSet: Array<{ url: string, density: number }>
}

export interface IArticleCardProps {
    article: any
    preview?: IImage
}

export const ArticleCard: React.FC<IArticleCardProps> = ({ article, ...props }) => (
    <section className="ArticleCard">
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
            }

            .ArticleCard-image {
                overflow: hidden;
                position: relative;
                width: 100%;
                height: var(--article-card-image-height);
            }

            .ArticleCard-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;

                transition: all 150ms ease-out;

                position: absolute;
                top: 0;
                left: 0;
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
                width: 105%;
                height: 105%;

                top: -2.5%;
                left: -2.5%;
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

            @media (max-width: 31.25em) {
                .ArticleCard {
                    --article-card-width: 100%;
                    --article-card-margin: var(--single-margin) 0;
                }
            }
        `}</style>

        <a className="invisible" href={article.url}>
            <div className="ArticleCard-image">
                {!props.preview ? null : (
                    <picture>
                        <img
                            className={cx({ opa: false })}
                            alt={props.preview.alt}
                            src={props.preview.src}
                            srcSet={props.preview.srcSet.map(({ url, density }) => `${url} ${density}x`).join(' ')}
                        />
                    </picture >
                )}
            </div>

            <div className="ArticleCard-body">
                {article.title}

                {!article.date ? null : (
                    <Date>{article.date}</Date>
                )}
            </div>
        </a>
    </section>
)
