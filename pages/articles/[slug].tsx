import Head from 'next/head'
import { range } from 'lodash'
import { App } from 'src/components/App'
import { ArticleGrid } from 'src/components/ArticleGrid'
import menuModel from 'src/models/menu'
import { buildMenu } from 'src/lib/menu'
import { meta } from 'src/lib/meta'
import { Meta } from 'src/components/Meta'
import { createApiUrl, requestGet, IResponseItems } from 'src/next-lib'
import { NextPage } from 'next'

const pageSize = Number(process.env.APP_ARTICLES_PAGE_SIZE)

type Props = {
    pageUrl: string
    meta: any
    title: string
    data: any //(list of article)
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
            menu={buildMenu(props.pageUrl, menuModel)}
            showAuthor={true}
            wide={true}
            contentStyle={{
                margin: 'var(--size-l) var(--size-xl)'
            }}
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
    const pageUrl = '/'
    // const page = parseInt(ctx.query.page)
    const page = parseInt(ctx.params.slug)
    const res = await requestGet<IResponseItems<any[]>>(
        createApiUrl(`/api/articles?page=${page}&pageSize=${pageSize}`),
        null
    )
    if (!res) {
        return null
    }

    const data = res.items || []
    const nextPage = (res as any).nextPage
    const prevPage = (res as any).prevPage
    const title = 'События'

    return {
        props: {
            data,
            nextPage,
            prevPage,
            pageUrl,
            title,
            meta: meta({
                title,
            })
        }
    }
}

export const unstable_getStaticPaths = async () => {
    console.log('call articles unstable_getStaticPaths')

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
