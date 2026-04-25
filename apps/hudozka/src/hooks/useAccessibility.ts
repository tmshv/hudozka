import { useSnapshot } from "valtio"
import { theme } from "@/store/theme"

function useAccessibility(): boolean {
    const t = useSnapshot(theme)

    return t.theme === "contrast"
}

export default useAccessibility
