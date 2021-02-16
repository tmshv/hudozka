import Head from 'next/head'
import Image from 'next/image'
import { App } from 'src/components/App'
import { tail } from 'lodash'
import { Page } from 'src/components/Page'
import { Markdown } from 'src/components/Markdown'
import { Meta } from 'src/components/Meta'
import { MetaBuilder } from 'src/lib/meta'
import { apiGet } from '@/next-lib'
import { GetStaticProps, NextPage } from 'next'
import { IBreadcumbsPart, IMeta, ITag, FileTokenData, Token } from '@/types'
import { joinTokens } from 'src/lib/tokens'
import { size, ext } from 'src/lib/file'
import { Html } from 'src/components/Html'
import { Youtube } from '@/components/Youtube'
import { createPage, createPageUrls } from '@/remote/factory'
import { paramsToSlug } from '@/remote/lib'

async function getUrls() {
    let urls = []

    const limit = 100
    let start = 0
    while (true) {
        const url = `https://hudozka.tmshv.com/pages?_limit=${limit}&_start=${start}`
        const res = await apiGet(createPageUrls)(url, null)

        if (!res || res.items.length === 0) {
            break
        }

        start += limit
        urls = [...urls, ...res.items]
    }

    return urls
}

const File: React.SFC<FileTokenData> = props => {
    const fileSize = size(props.file_size)
    const format = ext(props.file_format)

    return (
        <div className={'document-row'}>
            <a href={props['url']} className="invisible">
                <div className="document-row__image">
                    <Image
                        src={props['image_url']}
                        width={200}
                        height={200}
                    />
                </div>
            </a>

            <div className="document-row__file">
                <a href={props['url']}>{props['title']}</a>
            </div>

            <div className="document-row__file-info">
                <a href={props.file_url} target="_blank">
                    {format} ({fileSize})
                </a>
            </div>
        </div>
    )
}

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
                                    key={i}
                                    data={x.data}
                                />
                            )

                        case 'html':
                            return (
                                <Html
                                    key={i}
                                    html={x.data}
                                />
                            )

                        case 'instagram':
                            return (
                                <Html
                                    key={i}
                                    html={x.data.embed}
                                />
                            )

                        case 'youtube':
                            return (
                                <Youtube
                                    key={i}
                                    url={x.data.url}
                                />
                            )

                        case 'image':
                            return (
                                <div key={i} className="kazimir__image">
                                    <figure>
                                        <Image
                                            src={x.data.src}
                                            alt={x.data.alt}
                                            width={x.data.width}
                                            height={x.data.height}
                                        />
                                        <figcaption>{x.data.caption}</figcaption>
                                    </figure>
                                </div>
                            )

                        case 'file':
                            return (
                                <File key={i} {...x.data} />
                            )

                        default:
                            return (
                                <pre key={i}>
                                    {JSON.stringify(x)}
                                </pre>
                            )
                    }
                })}
            </article>
        </Page>
    </App>
)

export const getStaticProps: GetStaticProps<any> = async ctx => {
    const slug = paramsToSlug(ctx.params.slug)
    const url = `https://hudozka.tmshv.com/pages?slug=${slug}`
    const page = await apiGet(createPage)(url, null)
    if (!page) {
        console.log('kek something happend');

        return {
            notFound: true,
        }
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

    tokens.push({
        token: 'slug',
        data: {
            slug,
        }
    })

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
    const urls = await getUrls()

    return {
        fallback: false,
        paths: urls
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
