import Image from "next/image"
import { PageCardDto } from "@/types"
import { CardGrid } from "../CardGrid"
import { Card, CardLayout } from "../Card"
import { Date } from "./Date"
import { Spacer } from "../Spacer"
import { Box } from "@/ui/Box"
import { useMobile } from "@/hooks/useMobile"

function itemColumn(item: PageCardDto): string {
    return item.featured ? "span 2" : "auto"
}

function itemLayout(item: PageCardDto): CardLayout {
    return item.featured ? "featured" : "simple"
}

export type PageGridProps = {
    items: PageCardDto[]
}

export const PageGrid: React.FC<PageGridProps> = props => {
    const mobile = useMobile()

    return (
        <CardGrid
            style={{
                marginBottom: "var(--size-xl)",
            }}
        >
            {props.items.map(item => {
                const gridColumn = mobile
                    ? "auto"
                    : itemColumn(item)
                const layout = itemLayout(item)

                const content = !item.featured
                    ? (
                        <Box vertical>
                            {item.title}
                            <Spacer />
                            {!item.date ? null : (
                                <Date style={{
                                    marginTop: "var(--size-m)",
                                }}>{item.date}</Date>
                            )}
                        </Box>
                    ) : (
                        item.title
                    )

                return (
                    <Card
                        key={item.id}
                        href={item.url}
                        cover={(
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
                        )}
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


