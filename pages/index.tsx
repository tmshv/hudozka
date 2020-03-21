import Head from 'next/head'
import { App } from 'src/components/App'
import { Meta } from 'src/components/Meta'
import { PageGrid } from 'src/components/PageGrid'
import { HudozkaTitle } from 'src/components/HudozkaTitle'
import { MetaBuilder } from 'src/lib/meta'
import { getPagesCardsByTags } from 'src/rest'
import { NextPage } from 'next'
import { IMeta, PageCardData, PageCardDto } from 'src/types'

type Props = {
    title: string
    meta: IMeta
    items: PageCardDto[]
}

const Index: NextPage<Props> = props => {
    const items = props.items.map<PageCardData>(item => ({
        url: item.url,
        title: item.title,
        featured: item.featured,
        date: new Date(item.date),
        coverSrc: item.cover?.src,
    }))

    return (
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
                items={items}
            />
        </App>
    )
}

export const getStaticProps = async () => {
    const items = await getPagesCardsByTags([
        'event',
        'album',
        'post',
    ])
    const title = 'Шлиссельбургская ДХШ'
    const meta = (new MetaBuilder())
        .setTitle(title)
        .setData({
            url: '/',
        })
        .build()

    return {
        props: {
            items,
            title,
            meta,
        }
    }
}

export default Index
