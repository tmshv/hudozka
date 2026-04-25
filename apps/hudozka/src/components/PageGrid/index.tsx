"use client"

import { useMobile } from "@hudozka/hooks"
import { Box } from "@hudozka/ui"
import Image from "next/image"
import type { PageCardDto } from "@/types"
import type { CardLayout } from "../Card"
import { Card } from "../Card"
import { CardGrid } from "../CardGrid"
import { Spacer } from "../Spacer"
import { DateLine } from "./Date"

function itemColumn(item: PageCardDto): string {
    return item.featured ? "span 2" : "auto"
}

function itemLayout(item: PageCardDto): CardLayout {
    return item.featured ? "featured" : "simple"
}

export type PageGridProps = {
    items: PageCardDto[]
}

export function PageGrid(props: PageGridProps) {
    const mobile = useMobile()

    return (
        <CardGrid
            style={{
                marginBottom: "var(--size-xl)",
            }}
        >
            {props.items.map(item => {
                const gridColumn = mobile ? "auto" : itemColumn(item)
                const layout = itemLayout(item)

                const content = !item.featured ? (
                    <Box vertical>
                        {item.title}
                        <Spacer />
                        {!item.date ? null : (
                            <DateLine
                                style={{
                                    marginTop: "var(--size-m)",
                                }}
                            >
                                {item.date}
                            </DateLine>
                        )}
                    </Box>
                ) : (
                    item.title
                )

                return (
                    <Card
                        key={item.id}
                        href={item.url}
                        cover={
                            <Image
                                fill
                                style={{
                                    objectFit: "cover",
                                }}
                                src={item.cover.src}
                                alt={item.cover.alt ?? ""}
                                placeholder={item.cover.blur ? "blur" : "empty"}
                                blurDataURL={item.cover.blur}
                            />
                        }
                        layout={layout}
                        style={{
                            gridColumn,
                        }}
                    >
                        {content}
                    </Card>
                )
            })}
        </CardGrid>
    )
}
