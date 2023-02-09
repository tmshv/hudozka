import Image from "next/image"
import { PageCardDto } from "@/types"
import { CardGrid } from "../CardGrid"
import { Card, CardLayout } from "../Card"
import { Date } from "./Date"
import { Spacer } from "../Spacer"
import { Box } from "@/ui/Box"

export type PageGridProps = {
    items: PageCardDto[]
}

export const PageGrid: React.FC<PageGridProps> = props => {
    return (
        <CardGrid
            style={{
                marginBottom: "var(--size-xl)",
            }}
        >
            {props.items.map(item => {
                const gridColumn = item.featured ? "span 2" : "auto"
                const layout: CardLayout = item.featured ? "featured" : "simple"

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
