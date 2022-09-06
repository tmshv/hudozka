import Head from "next/head"
import { App } from "src/components/App"
import { Meta } from "src/components/Meta"
import { PageGrid } from "src/components/PageGrid"
import { HudozkaTitle } from "src/components/HudozkaTitle"
import { MetaBuilder } from "src/lib/meta"
import { GetStaticProps, NextPage } from "next"
import { IMenu, IMeta, PageCardDto } from "src/types"
import { apiGet } from "@/next-lib"
import { createHomeCards, createMenu } from "@/remote/factory"

type Props = {
    title: string
    meta: IMeta
    menu: IMenu[]
    items: PageCardDto[]
}

const Index: NextPage<Props> = props => (
    <App
        showAuthor={true}
        menu={props.menu}
    >
        <Head>
            <title>{props.title}</title>
            <Meta meta={props.meta} />
        </Head>

        <HudozkaTitle
            style={{
                marginTop: "var(--size-m)",
                marginBottom: "var(--size-m)",
            }}
        />

        <PageGrid
            items={props.items}
        />
    </App>
)

export const getStaticProps: GetStaticProps<Props> = async () => {
    const items = await apiGet(createHomeCards)("https://hudozka.tmshv.com/home", async () => [])
    const menu = await apiGet(createMenu)("https://hudozka.tmshv.com/menu", () => [])

    const title = "Шлиссельбургская ДХШ"
    const meta = (new MetaBuilder())
        .setTitle(title)
        .setData({
            url: "/",
        })
        .build()

    return {
        props: {
            items,
            title,
            meta,
            menu,
        },
        revalidate: 30,
    }
}

export default Index
