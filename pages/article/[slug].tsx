import Head from 'next/head'
import { App } from 'src/components/App'
import { Article } from 'src/components/Article'
import { Html } from 'src/components/Html'
import { Meta } from 'src/components/Meta'
import { MetaBuilder } from 'src/lib/meta'
import { createApiUrl, requestGet, IResponseItems } from 'src/next-lib'
import { NextPage } from 'next'
import { IArticle, IMeta } from 'src/types'

type Props = {
    title: string
    meta: IMeta
    data: IArticle
}

const Page: NextPage<Props> = props => {
    if (!props.data) {
        console.log('kek error', props)
        return null
    }

    return (
        <App
            showAuthor={true}
        >
            <Head>
                <title>{props.title}</title>
                <Meta meta={props.meta} />
            </Head>
            <Article
                title={props.title}
                date={props.data.date}
                tags={props.data.tags}
                shareable={true}
            >
                <Html
                    html={props.data.post}
                />
            </Article>
        </App>
    )
}

export const unstable_getStaticProps = async (ctx: any) => {
    const id = ctx.params.slug
    const data = await requestGet<IArticle>(createApiUrl(`/api/articles/${id}`), null)
    if (!data) {
        return null
    }

    const meta = (new MetaBuilder())
        .setImage(data.preview)
        .setTitle(data.title)
        .build()

    return {
        props: {
            title: data.title,
            data,
            meta,
        }
    }
}

export const unstable_getStaticPaths = async () => {
    const urls = await requestGet<IResponseItems<string>>(createApiUrl(`/api/articles/urls`), null)
    if (!urls) {
        return null
    }

    return {
        paths: urls.items
            .map(x => x.replace('/article/', ''))
            .map(slug => {
                return {
                    params: {
                        slug,
                    },
                }
            }),
    }
}

export default Page
