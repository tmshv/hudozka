import Head from 'next/head'
import { App } from 'src/components/App'
import { Meta } from 'src/components/Meta'
import { ArticleGrid } from 'src/components/ArticleGrid'
import { HudozkaTitle } from 'src/components/HudozkaTitle'
import { meta, MetaBuilder } from 'src/lib/meta'
import { createApiUrl, requestGet, IResponseItems } from 'src/next-lib'
import { NextPage } from 'next'
import { IArticle } from 'src/types'

interface IProps {
    title: string
    meta: any
    prevPage: number
    nextPage: number
    articles: any[]
}

const Page: NextPage<IProps> = props => (
    <App
        showAuthor={true}
        wide={true}
    >
        <Head>
            <title>{props.title}</title>
            <Meta meta={props.meta} />
        </Head>

        <HudozkaTitle
            style={{
                marginBottom: 'var(--size-l)'
            }}
        />

        <ArticleGrid
            articles={props.articles}
            prevPage={props.prevPage}
            nextPage={props.nextPage}
        />
    </App>
)

export const unstable_getStaticProps = async () => {
    const page = 1
    const pageSize = process.env.APP_ARTICLES_PAGE_SIZE
    const res = await requestGet<IResponseItems<IArticle>>(createApiUrl(`/api/articles?page=${page}&pageSize=${pageSize}`), null)
    const articles = (res.items || [])
    const nextPage = res.nextPage
    const prevPage = res.prevPage
    const title = 'Шлиссельбургская ДХШ'
    const meta = (new MetaBuilder())
        .setTitle(title)
        .setData({
            url: '/',
        })
        .build()

    return {
        props: {
            articles,
            nextPage,
            prevPage,
            title,
            meta,
        }
    }
}

export default Page
