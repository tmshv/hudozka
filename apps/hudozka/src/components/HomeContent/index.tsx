"use client"

import { HudozkaTitle } from "@/components/HudozkaTitle"
import { PageGrid } from "@/components/PageGrid"
import { useMobile } from "@/hooks/useMobile"
import type { PageCardDto } from "@/types"

export type HomeContentProps = {
    items: PageCardDto[]
}

export function HomeContent({ items }: HomeContentProps) {
    const mobile = useMobile()

    return (
        <>
            {mobile ? null : (
                <HudozkaTitle
                    style={{
                        marginTop: "var(--size-m)",
                        marginBottom: "var(--size-m)",
                    }}
                />
            )}

            <PageGrid items={items} />
        </>
    )
}
