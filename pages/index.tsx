import Head from 'next/head'
import { App } from 'src/components/App'
import { Meta } from 'src/components/Meta'
import { PageGrid } from 'src/components/PageGrid'
import { HudozkaTitle } from 'src/components/HudozkaTitle'
import { MetaBuilder } from 'src/lib/meta'
import { NextPage } from 'next'
import { IMeta, PageCardDto } from 'src/types'
import { apiGet } from '@/next-lib'
import { createHomeCards } from '@/remote/factory'

type Props = {
    title: string
    meta: IMeta
    items: PageCardDto[]
}

const Index: NextPage<Props> = props => (
    <App
        showAuthor={true}
        wide={false}
    >
        <Head>
            <title>{props.title}</title>
            <Meta meta={props.meta} />
        </Head>

        <HudozkaTitle
            style={{
                marginTop: 'var(--size-m)',
                marginBottom: 'var(--size-m)',
            }}
        />

        <PageGrid
            items={props.items}
        />
    </App>
)

export const getStaticProps = async () => {
    const url = 'https://hudozka.tmshv.com/home'
    const items = await apiGet(createHomeCards)(url, [])

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
