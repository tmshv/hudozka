import { IArticle, ImageDefinition } from 'src/types'
import { Pager } from '../Pager'
import { CardGrid } from '../CardGrid'
import { Card, CardLayout } from '../Card'
import { Date } from './Date'
import { Block } from '../Block'
import { Spacer } from '../Spacer'

export interface IResizeImage {
    w: number
    h: number
}

export function resizeImage(src: string, options: IResizeImage): string {
    return src
    // return `https://images.weserv.nl/?url=${src}&w=${options.w}&h=${options.h}&n=-1`
}

function getImage(image?: ImageDefinition) {
    if (!image) {
        const defaultSrc = '/static/img/HudozkaMain2014.jpg'
        const src = resizeImage(defaultSrc, { w: 400, h: 400 })
        const set = [
            {
                density: 2,
                href: resizeImage(defaultSrc, { w: 800, h: 800 }),
            }
        ]
        const srcSet = set
            .map(({ href, density }) => `${href} ${density}x`)
            .join(' ')

        return {
            src,
            srcSet,
        }
    }

    const preview = image.artifacts.medium
    const src = preview.src
    const srcSet = preview.set.map(({ url, density }) => `${url} ${density}x`).join(' ')

    return {
        src,
        srcSet,
    }
}

export type ArticleGridProps = {
    articles: IArticle[]
    nextPage: number | null
    prevPage: number | null
}

export const ArticleGrid: React.FC<ArticleGridProps> = ({ articles, nextPage, prevPage, ...props }) => {
    const nextHref = nextPage ? `/articles/${nextPage}` : null
    let prevHref = prevPage ? `/articles/${prevPage}` : null
    if (prevPage === 1) {
        prevHref = '/'
    }

    return (
        <>
            <CardGrid
                style={{
                    marginBottom: 'var(--size-m)',
                }}
            >
                {articles.map((article, i) => {
                    const gridColumn = article.featured ? 'span 2' : 'auto'
                    const layout: CardLayout = article.featured ? 'featured' : 'simple'
                    const { src, srcSet } = getImage(article.preview)

                    const content = !article.featured
                        ? (
                            <Block
                                direction={'vertical'}
                            >
                                {article.title}
                                <Spacer />
                                <Date style={{
                                    marginTop: 'var(--size-m)',
                                }}>{article.date}</Date>
                            </Block>
                        ) : (
                            article.title
                        )

                    return (
                        <Card
                            key={i}
                            href={article.url}
                            img={{
                                alt: article.title,
                                src,
                                srcSet,
                            }}
                            layout={layout}
                            style={{
                                gridColumn,
                            }}
                        >
                            {content}
                        </Card>
                    )
                })}
            </CardGrid>

            <Pager
                nextHref={nextHref}
                prevHref={prevHref}
            />
        </>
    )
}
