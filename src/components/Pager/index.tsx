import { Block, BlockProps } from "../Block"
import { Button } from "@/ui/Button"
import { Spacer } from "../Spacer"

export type PagerProps = Omit<BlockProps, "direction"> & {
    nextHref: string | null
    prevHref: string | null
}

export const Pager: React.FC<PagerProps> = ({ prevHref, nextHref, ...props }) => (
    <Block {...props} direction={"horizontal"}>
        {!prevHref ? null : (
            <Button href={prevHref}>Предыдущая страница</Button>
        )}
        <Spacer />
        {!nextHref ? null : (
            <Button href={nextHref}>Следущая страница</Button>
        )}
    </Block>
)
