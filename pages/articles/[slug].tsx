import Head from 'next/head'
import { range } from 'lodash'
import { App } from 'src/components/App'
import { ArticleGrid } from 'src/components/ArticleGrid'
import { MetaBuilder } from 'src/lib/meta'
import { Meta } from 'src/components/Meta'
import { createApiUrl, requestGet, IResponseItems } from 'src/next-lib'
import { NextPage } from 'next'
import { IArticle } from 'src/types'

const pageSize = Number(process.env.APP_ARTICLES_PAGE_SIZE)

type Props = {
    meta: any
    title: string
    data: IArticle[]
    nextPage: number
    prevPage: number
}

const Page: NextPage<Props> = props => {
    if (!props.data) {
        console.log('kek error', props)
        return null
    }

    return (
        <App
            showAuthor={true}
            wide={true}
        >
            <Head>
                <title>{props.title}</title>
                <Meta meta={props.meta} />
            </Head>
            <ArticleGrid
                articles={props.data}
                prevPage={props.prevPage}
                nextPage={props.nextPage}
            />
        </App>
    )
}

export const unstable_getStaticProps = async (ctx: any) => {
    const page = parseInt(ctx.params.slug)
    const res = await requestGet<IResponseItems<IArticle>>(createApiUrl(`/api/articles?page=${page}&pageSize=${pageSize}`), null)
    if (!res) {
        return null
    }

    const data = (res.items || [])
    const nextPage = res.nextPage
    const prevPage = res.prevPage
    const title = 'События'
    const meta = (new MetaBuilder())
        .setTitle(title)
        .build()

    return {
        props: {
            data,
            nextPage,
            prevPage,
            title,
            meta,
        }
    }
}

export const unstable_getStaticPaths = async () => {
    const urls = await requestGet<IResponseItems<string>>(createApiUrl(`/api/articles/urls`), null)
    if (!urls) {
        return null
    }

    const count = urls.items.length
    const pages = Math.ceil(count / pageSize)

    return {
        paths: range(1, pages + 1)
            .map(i => {
                return {
                    params: {
                        slug: `${i}`,
                    },
                }
            }),
    }
}


export default Page
