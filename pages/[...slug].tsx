import Head from "next/head"
import { App } from "src/components/App"
import { Page } from "src/components/Page"
import { NextSeo } from "next-seo"
import { MetaBuilder } from "src/lib/meta"
import { GetStaticProps, NextPage } from "next"
import { IBreadcumbsPart, IMenu, IMeta, ITag, Sign, Token } from "@/types"
import { Html } from "src/components/Html"
import { Youtube } from "@/components/Youtube"
import { paramsToSlug } from "@/remote/lib"
import { PageGrid } from "@/components/PageGrid"
import { useRouter } from "next/router"
import { FileCard } from "@/components/FileCard"
import { Picture } from "@/ui/Picture"
import { tail } from "@/lib/array"
import { getMenu, getPageBySlug, getUrls } from "@/remote/api"

type Props = {
    title: string
    tags: ITag[]
    date: string
    breadcrumb: IBreadcumbsPart[]
    meta?: IMeta
    menu: IMenu[],
    tokens: Token[]
    documentSignature: Sign
}

const Index: NextPage<Props> = props => {
    const router = useRouter()
    if (router.isFallback) {
        return (
            <div>
                loading...
            </div>
        )
    }

    return (
        <>
            {!props.meta ? null : (
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
            )}

            <App
                contentStyle={{
                    marginTop: "var(--size-l)",
                    marginBottom: "var(--size-xl)",
                }}
                menu={props.menu}
                breadcrumbs={props.breadcrumb}
            >
                <Head>
                    <title>{props.title}</title>
                </Head>

                <Page
                    tags={props.tags}
                    date={props.date ? new Date(props.date) : undefined}
                >
                    <article className={"article"}>
                        {props.tokens.map((x, i) => {
                            switch (x.token) {
                            case "html":
                                return (
                                    <Html
                                        key={i}
                                        html={x.data}
                                    />
                                )

                            case "instagram":
                                return (
                                    <Html
                                        key={i}
                                        html={x.data.embed}
                                    />
                                )

                            case "youtube":
                                return (
                                    <Youtube
                                        key={i}
                                        url={x.data.url}
                                    />
                                )

                            case "image":
                                return (
                                    <Picture
                                        key={i}
                                        src={x.data.src}
                                        alt={x.data.alt}
                                        width={x.data.width}
                                        height={x.data.height}
                                        caption={x.data.caption}
                                        blur={x.data.blur}
                                        wide={x.wide}
                                    />
                                )

                            case "file":
                                return (
                                    <FileCard
                                        key={i}
                                        sign={props.documentSignature}
                                        {...x.data}
                                    />
                                )

                            case "grid":
                                return (
                                    <PageGrid
                                        key={i}
                                        items={x.data.items}
                                    />
                                )

                            default:
                                return (
                                    <pre key={i}>
                                        {JSON.stringify(x)}
                                    </pre>
                                )
                            }
                        })}
                    </article>
                </Page>
            </App>
        </>
    )
}

export const getStaticProps: GetStaticProps<Props> = async ctx => {
    const slug = paramsToSlug(ctx.params?.slug ?? [])
    const page = await getPageBySlug(slug)
    if (!page) {
        return {
            notFound: true,
        }
    }

    const menu = await getMenu()

    const description = page.description ?? undefined
    const breadcrumbSize = page?.breadcrumb?.length ?? 0
    const breadcrumb = breadcrumbSize < 2 ? [] : page.breadcrumb ?? []
    const meta = (new MetaBuilder())
        .setImage(page.cover)
        .setTitle(page.title)
        .setDescription(description)
        .build()
    const tokens = page.tokens

    return {
        revalidate: 30,
        props: {
            tokens,
            title: page.title,
            tags: page.tags,
            date: page.date,
            meta,
            menu,
            breadcrumb,
            documentSignature: {
                date: "20.01.2021г.",
                person: "Тимашева Марина Геннадьевна",
                position: "Директор",
                signature: "0ac4ea89753a4ba9893799442325fb41",
            },
        },
    }
}

export const getStaticPaths = async () => {
    const urls = await getUrls()

    return {
        fallback: true,
        paths: urls
            .map(path => {
                const slug = tail(path.split("/"))

                return {
                    params: {
                        slug,
                    },
                }
            }),
    }
}

export default Index
