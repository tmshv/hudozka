import { useEffect } from "react"
import { getCode } from "./lib"
import InnerHTML from "dangerously-set-html-content"

export type GosuslugiProps = {}

export const Gosuslugi: React.FC<GosuslugiProps> = () => {
    useEffect(() => {
        const id = setTimeout(() => {
            // This call taken from getCode <script>Widget("https://pos.gosuslugi.ru/form", 312519)</script>
            (window as any).Widget("https://pos.gosuslugi.ru/form", 312519)
        }, 100)

        return () => {
            clearTimeout(id)
        }
    }, [])

    return (
        <InnerHTML html={getCode()} />
    )
}

