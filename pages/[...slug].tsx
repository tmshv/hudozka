import Head from 'next/head'
import { App } from 'src/components/App'
import { tail } from 'lodash'
import { Page } from 'src/components/Page'
import { Markdown } from 'src/components/Markdown'
import { Meta } from 'src/components/Meta'
import { MetaBuilder } from 'src/lib/meta'
import { createApiUrl, requestGet, IResponseItems } from 'src/next-lib'
import { NextPage } from 'next'
import { IBreadcumbsPart, IMeta, IPage, ITag, FileTokenData, Token } from 'src/types'
import { joinTokens } from 'src/lib/tokens'

function array<T>(value: T | T[]) {
    return Array.isArray(value)
        ? value
        : [value]
}

const File: React.SFC<FileTokenData> = props => (
    <div className="document-row">
        <a href={props['url']} className="invisible">
            <div className="document-row__image">
                <img src={props['image_url']} alt={props['title']} />
            </div>
        </a>

        <div className="document-row__file">
            <a href={props['url']}>{props['title']}</a>
        </div>

        <div className="document-row__file-info">
            <a href="document['file_url']" target="_blank">
                {props.file_format} ({props.file_size})
                </a>
        </div>
    </div>
)

type Props = {
    title: string
    tags: ITag[]
    date: string
    breadcrumb: IBreadcumbsPart[]
    meta?: IMeta
    tokens?: Token[]
}

const Index: NextPage<Props> = props => (
    <App
        contentStyle={{
            marginTop: 'var(--size-l)',
            marginBottom: 'var(--size-xl)',
        }}
        breadcrumbs={props.breadcrumb}
    >
        <Head>
            <title>{props.title}</title>
            {!props.meta ? null : (
                <Meta meta={props.meta} />
            )}
        </Head>

        <Page
            tags={props.tags}
            date={props.date ? new Date(props.date) : null}
        >
            <article className={'article'}>
                {joinTokens(props.tokens ?? []).map((x, i) => {
                    switch (x.token) {
                        case 'text':
                            return (
                                <Markdown
                                    data={x.data}
                                />
                            )

                        case 'image':
                            return (
                                <div className="kazimir__image">
                                    <figure>
                                        <img
                                            src={x.data.src}
                                            alt={x.data.alt}
                                        />
                                        <figcaption>{x.data.caption}</figcaption>
                                    </figure>
                                </div>
                            )

                        case 'file':
                            return (
                                <File {...x.data} />
                            )

                        default:
                            return (
                                <pre>
                                    {JSON.stringify(x)}
                                </pre>
                            )
                    }
                })}
            </article>
        </Page>
    </App>
)

export const getStaticProps = async (ctx: any) => {
    let slug = null
    if (ctx.query) {
        slug = '/' + array(ctx.query.slug).join('/')
    } else {
        slug = '/' + array(ctx.params.slug).join('/')
    }
    const page = await requestGet<IPage>(createApiUrl(`/api/page?page=${slug}`), null)
    if (!page) {
        throw new Error(`Not found: ${slug}`)
    }
    const description = page.description ?? undefined
    const breadcrumbSize = page?.breadcrumb?.length ?? 0
    const breadcrumb = breadcrumbSize < 2 ? null : page.breadcrumb
    const meta = (new MetaBuilder())
        .setImage(page.cover)
        .setTitle(page.title)
        .setDescription(description)
        .build()
    const tokens = page.tokens

    return {
        props: {
            tokens,
            title: page.title,
            tags: page.tags,
            date: page.date,
            meta,
            breadcrumb,
        }
    }
}

export const getStaticPaths = async () => {
    const urls = await requestGet<IResponseItems<string>>(createApiUrl(`/api/pages/urls`), null)
    if (!urls) {
        return null
    }

    return {
        fallback: true,
        paths: urls.items
            .map(path => {
                const slug = tail(path.split('/'))

                return {
                    params: {
                        slug,
                    },
                }
            }),
    }
}

export default Index
