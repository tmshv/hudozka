import Head from 'next/head'
import { get } from 'lodash'
import { App } from 'src/components/App'
import { Article } from 'src/components/Article'
import { Html } from 'src/components/Html'
import menuModel from 'src/models/menu'
import { buildMenu } from 'src/lib/menu'
import { Meta } from 'src/components/Meta'
import { meta } from 'src/lib/meta'
import { createApiUrl, requestGet, IResponseItems } from 'src/next-lib'
import { NextPage } from 'next'
import { IArticle } from 'src/types'

type Props = {
    pageUrl: string
    meta: any
    data: IArticle
}

const Page: NextPage<Props> = props => {
    if (!props.data) {
        console.log('kek error', props)
        return null
    }

    return (
        <App
            menu={buildMenu(props.pageUrl, menuModel)}
            showAuthor={true}
        >
            <Head>
                <title>{props.data.title}</title>
                <Meta meta={props.meta} />
            </Head>
            <Article
                title={props.data.title}
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
    const pageUrl = '/'
    const id = ctx.params.slug
    const data = await requestGet(createApiUrl(`/api/articles/${id}`), null)
    if (!data) {
        return null
    }

    const image = get(data, 'preview.artifacts.fb', {})

    return {
        props: {
            data,
            pageUrl,
            meta: meta({
                title: data.title,
                image: image.src,
                imageWidth: image.width,
                imageHeight: image.height,
            }),
        }
    }
}

export const unstable_getStaticPaths = async () => {
    console.log('call article unstable_getStaticPaths')

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
