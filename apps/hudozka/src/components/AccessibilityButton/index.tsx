import { theme, toggleTheme } from "@/store/theme"
import { Button } from "@/ui/Button"
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi"
import { useSnapshot } from "valtio"

export function AccessibilityButton() {
    const t = useSnapshot(theme)

    return (
        <Button
            theme="icon"
            size="default"
            onClick={toggleTheme}
        >
            {t.theme === "default" ? (
                <HiOutlineEyeOff size={24} />
            ) : (
                <HiOutlineEye size={24} />
            )}
        </Button>
    )
}
