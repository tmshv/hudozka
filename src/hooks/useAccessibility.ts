import { theme } from "@/store/theme"
import { useSnapshot } from "valtio"

function useAccessibility(): boolean {
    const t = useSnapshot(theme)

    return t.theme === "contrast"
}

export default useAccessibility
