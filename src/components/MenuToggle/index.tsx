import { Button } from "@/ui/Button"
import { HamburgerMenuIcon, Cross1Icon } from "@radix-ui/react-icons"

export interface IMenuToggleProps {
    style?: React.CSSProperties
    open: boolean
    onClick: () => void
}

export const MenuToggle: React.FC<IMenuToggleProps> = props => {
    return (
        <Button
            onClick={props.onClick}
            style={props.style}
            theme={"icon"}
        >
            {props.open ? (
                <Cross1Icon width={24} height={24} />
            ) : (
                <HamburgerMenuIcon width={24} height={24} />
            )}
        </Button>
    )
}
