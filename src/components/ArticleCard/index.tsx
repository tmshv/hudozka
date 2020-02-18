import './styles.css'

import cx from 'classnames'
import { Date } from './Date'
import { IImage } from 'src/types'

export interface IArticleCardProps {
    article: any
    preview?: IImage
}

export const ArticleCard: React.FC<IArticleCardProps> = ({ article, ...props }) => (
    <section className="ArticleCard">
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
                    <Date>
                        {article.date}
                    </Date>
                )}
            </div>
        </a>
    </section>
)
