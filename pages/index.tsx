import Head from "next/head"
import { App } from "@/components/App"
import { generateNextSeo } from "next-seo/pages"
import { PageGrid } from "@/components/PageGrid"
import { HudozkaTitle } from "@/components/HudozkaTitle"
import { MetaBuilder } from "@/lib/meta"
import type { GetStaticProps, NextPage } from "next"
import type { MenuItem, Meta, PageCardDto } from "@/types"
import { useMobile } from "@/hooks/useMobile"
import { getHomeCards, getMenu } from "@/remote/api"

type Props = {
    title: string
    meta: Meta
    menu: MenuItem[]
    items: PageCardDto[]
}

const Index: NextPage<Props> = props => {
    const mobile = useMobile()

    return (
        <>
            <Head>
                {generateNextSeo({
                    title: props.meta.title,
                    description: props.meta.description,
                    canonical: "https://art.shlisselburg.org/",
                    openGraph: {
                        url: props.meta.url,
                        title: props.meta.title,
                        description: props.meta.description,
                        images: [
                            {
                                url: props.meta.image,
                                width: props.meta.imageWidth,
                                height: props.meta.imageHeight,
                                alt: props.meta.description,
                                type: "image/jpeg",
                            },
                        ],
                        siteName: props.meta.siteName,
                    },
                })}
                <title>{props.title}</title>
            </Head>
            <App
                showAuthor={true}
                menu={props.menu}
            >
                {mobile ? null : (
                    <HudozkaTitle
                        style={{
                            marginTop: "var(--size-m)",
                            marginBottom: "var(--size-m)",
                        }}
                    />
                )}

                <PageGrid
                    items={props.items}
                />
            </App>
        </>
    )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
    const items = await getHomeCards()
    const menu = await getMenu()

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
