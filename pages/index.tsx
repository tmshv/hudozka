import Head from "next/head"
import { App } from "src/components/App"
import { NextSeo } from "next-seo"
import { PageGrid } from "src/components/PageGrid"
import { HudozkaTitle } from "src/components/HudozkaTitle"
import { MetaBuilder } from "src/lib/meta"
import { GetStaticProps, NextPage } from "next"
import { IMenu, IMeta, PageCardDto } from "src/types"
import { useMobile } from "@/hooks/useMobile"
import { getHomeCards, getMenu } from "@/remote/api"

type Props = {
    title: string
    meta: IMeta
    menu: IMenu[]
    items: PageCardDto[]
}

const Index: NextPage<Props> = props => {
    const mobile = useMobile()

    return (
        <>
            <NextSeo
                title={props.meta.title}
                description={props.meta.description}
                canonical="https://art.shlisselburg.org/"
                openGraph={{
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
                    site_name: props.meta.siteName,
                }}
            />
            <Head>
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
