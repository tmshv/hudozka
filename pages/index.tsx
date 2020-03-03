import Head from 'next/head'
import { App } from 'src/components/App'
import { Meta } from 'src/components/Meta'
import { PageGrid } from 'src/components/PageGrid'
import { HudozkaTitle } from 'src/components/HudozkaTitle'
import { MetaBuilder } from 'src/lib/meta'
import { getPagesCardsByTags } from 'src/rest'
import { NextPage } from 'next'
import { IPage, IMeta } from 'src/types'

interface IProps {
    title: string
    meta: IMeta
    items: IPage[]
}

const Index: NextPage<IProps> = props => (
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
            prevPage={null}
            nextPage={null}
        />
    </App>
)

export const unstable_getStaticProps = async () => {
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
