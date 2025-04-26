import { Button } from "@/ui/Button"
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi"
import { useTheme } from "@/ui/theme/useTheme"

export function AccessibilityButton() {
    const { theme, setTheme } = useTheme()

    return (
        <Button
            theme="icon"
            size="default"
            onClick={() => {
                setTheme(theme === "default" ? "contrast" : "default")
            }}
        >
            {theme === "default" ? (
                <HiOutlineEyeOff size={24} />
            ) : (
                <HiOutlineEye size={24} />
            )}
        </Button>
    )
}
