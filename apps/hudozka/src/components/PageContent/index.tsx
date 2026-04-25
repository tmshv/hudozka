"use client"

import { FileCard } from "@/components/FileCard"
import { Html } from "@/components/Html"
import { Page } from "@/components/Page"
import { PageGrid } from "@/components/PageGrid"
import { Youtube } from "@/components/Youtube"
import type { Sign, Tag, Token } from "@/types"
import { Picture } from "@/ui/Picture"

export type PageContentProps = {
    tags: Tag[]
    date?: string
    tokens: Token[]
    documentSignature: Sign
}

export function PageContent({ tags, date, tokens, documentSignature }: PageContentProps) {
    return (
        <Page tags={tags} date={date ? new Date(date) : undefined}>
            <article className={"article"}>
                {tokens.map(x => {
                    switch (x.token) {
                        case "html":
                            return <Html key={x.id} html={x.data} />

                        case "instagram":
                            return <Html key={x.id} html={x.data.embed} />

                        case "youtube":
                            return <Youtube key={x.id} url={x.data.url} />

                        case "image":
                            return (
                                <Picture
                                    key={x.id}
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
                            return <FileCard key={x.id} sign={documentSignature} {...x.data} />

                        case "grid":
                            return <PageGrid key={x.id} items={x.data.items} />

                        default:
                            return <pre key={(x as { id: string }).id}>{JSON.stringify(x)}</pre>
                    }
                })}
            </article>
        </Page>
    )
}
