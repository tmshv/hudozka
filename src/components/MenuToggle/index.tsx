import { Button, ButtonProps } from "@/ui/Button"
import { HamburgerMenuIcon, Cross1Icon } from "@radix-ui/react-icons"

export type MenuToggleProps = Omit<ButtonProps, "theme"> & {
    open: boolean
}

export const MenuToggle: React.FC<MenuToggleProps> = ({ open, ...props }) => {
    const icon = open ? (
        <Cross1Icon width={24} height={24} />
    ) : (
        <HamburgerMenuIcon width={24} height={24} />
    )
    return (
        <Button
            {...props}
            theme={"icon"}
        >
            {icon}
        </Button>
    )
}
