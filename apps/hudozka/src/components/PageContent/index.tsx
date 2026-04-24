"use client"

import { Page } from "@/components/Page"
import { Html } from "@/components/Html"
import { Youtube } from "@/components/Youtube"
import { Picture } from "@/ui/Picture"
import { FileCard } from "@/components/FileCard"
import { PageGrid } from "@/components/PageGrid"
import type { Tag, Token, Sign } from "@/types"

export type PageContentProps = {
    tags: Tag[]
    date?: string
    tokens: Token[]
    documentSignature: Sign
}

export function PageContent({ tags, date, tokens, documentSignature }: PageContentProps) {
    return (
        <Page
            tags={tags}
            date={date ? new Date(date) : undefined}
        >
            <article className={"article"}>
                {tokens.map((x, i) => {
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
                                sign={documentSignature}
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
    )
}
