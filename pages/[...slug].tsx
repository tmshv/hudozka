import Head from 'next/head'
import { App } from 'src/components/App'
import { tail } from 'lodash'
import { Page } from 'src/components/Page'
import { Markdown } from 'src/components/Markdown'
import { Meta } from 'src/components/Meta'
import { MetaBuilder } from 'src/lib/meta'
import { apiGet } from '@/next-lib'
import { GetStaticProps, NextPage } from 'next'
import { IBreadcumbsPart, IMenu, IMeta, ITag, Sign, Token } from '@/types'
import { Html } from 'src/components/Html'
import { Youtube } from '@/components/Youtube'
import { createMenu, createPage, createPageUrls } from '@/remote/factory'
import { paramsToSlug } from '@/remote/lib'
import { PageGrid } from '@/components/PageGrid'
import { useRouter } from 'next/router'
import { FileCard } from '@/components/FIleCard'
import { Picture } from '@/components/Picture'

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

type Props = {
    title: string
    tags: ITag[]
    date: string
    breadcrumb: IBreadcumbsPart[]
    meta?: IMeta
    menu: IMenu[],
    tokens: Token[]
    documentSignature: Sign
}

const Index: NextPage<Props> = props => {
    const router = useRouter()
    if (router.isFallback) {
        return (
            <div>
                loading...
            </div>
        )
    }

    return (
        <App
            contentStyle={{
                marginTop: 'var(--size-l)',
                marginBottom: 'var(--size-xl)',
            }}
            menu={props.menu}
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
                    {props.tokens.map((x, i) => {
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
                                    <Picture
                                        key={i}
                                        src={x.data.src}
                                        alt={x.data.alt}
                                        width={x.data.width}
                                        height={x.data.height}
                                        caption={x.data.caption}
                                        wide={x.wide}
                                    />
                                )

                            case 'file':
                                return (
                                    <FileCard
                                        key={i}
                                        sign={props.documentSignature}
                                        {...x.data}
                                    />
                                )

                            case 'grid':
                                return (
                                    <PageGrid
                                        key={i}
                                        items={x.data.items}
                                    />
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
}

export const getStaticProps: GetStaticProps<Props> = async ctx => {
    const slug = paramsToSlug(ctx.params.slug)
    const url = `https://hudozka.tmshv.com/pages?slug=${slug}`
    const page = await apiGet(createPage)(url, null)
    if (!page) {
        return {
            notFound: true,
        }
    }

    const menu = await apiGet(createMenu)('https://hudozka.tmshv.com/menu', [])

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
        revalidate: 30,
        props: {
            tokens,
            title: page.title,
            tags: page.tags,
            date: page.date,
            meta,
            menu,
            breadcrumb,
            documentSignature: {
                date: '20.01.2021г.',
                person: 'Тимашева Марина Геннадьевна',
                position: 'Директор',
                signature: '0ac4ea89753a4ba9893799442325fb41',
            }
        }
    }
}

export const getStaticPaths = async () => {
    const urls = await getUrls()

    return {
        fallback: true,
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
