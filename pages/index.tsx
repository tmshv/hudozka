import Head from 'next/head'
import { App } from 'src/components/App'
import { Meta } from 'src/components/Meta'
import { PageGrid } from 'src/components/PageGrid'
import { HudozkaTitle } from 'src/components/HudozkaTitle'
import { MetaBuilder } from 'src/lib/meta'
import { createApiUrl, requestGet, IResponseItems } from 'src/next-lib'
import { NextPage } from 'next'
import { IPage } from 'src/types'

interface IProps {
    title: string
    meta: any
    prevPage: number
    nextPage: number
    items: any[]
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

        <PageGrid
            items={props.items}
            prevPage={props.prevPage}
            nextPage={props.nextPage}
        />
    </App>
)

export const unstable_getStaticProps = async () => {
    const page = 1
    // const pageSize = parseInt(process.env.APP_ARTICLES_PAGE_SIZE)
    const pageSize = 300

    const limit = pageSize
    const skip = (page - 1) * pageSize

    const tags = [
        'event',
        'album',
        'post',
    ]
    const tagQuery = tags
        .map(x => `tag=${x}`)
        .join('&')

    const url = `/api/pages/tags?${tagQuery}&skip=${skip}&limit=${limit}&sortBy=-date`
    const res = await requestGet<IResponseItems<IPage>>(createApiUrl(url), null)
    const articles = (res.items || [])
    // const nextPage = res.nextPage
    const nextPage = 2
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
