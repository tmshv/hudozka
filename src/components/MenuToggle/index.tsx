import { Button, ButtonProps } from "@/ui/Button"
import { HiOutlineMenuAlt4, HiOutlineX } from "react-icons/hi"

export type MenuToggleProps = Omit<ButtonProps, "theme"> & {
    open: boolean
}

export const MenuToggle: React.FC<MenuToggleProps> = ({ open, ...props }) => {
    const icon = open ? (
        <HiOutlineX size={24} />
    ) : (
        <HiOutlineMenuAlt4 size={24} />
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
