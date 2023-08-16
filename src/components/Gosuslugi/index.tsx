import { useEffect } from "react"
import { getCode } from "./lib"
import InnerHTML from "dangerously-set-html-content"

async function sleep(ms: number) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

async function repeat(delay: number, times: number, fn: () => void): Promise<void> {
    try {
        fn()
    } catch (error) {
        if (times === 0) {
            throw error
        }

        await sleep(delay)
        return repeat(delay, times - 1, fn)
    }
}

export type GosuslugiProps = {}

export const Gosuslugi: React.FC<GosuslugiProps> = () => {
    useEffect(() => {
        let mount = true
        repeat(1000, 50, () => {
            if (!mount) {
                return
            }

            // This call taken from getCode <script>Widget("https://pos.gosuslugi.ru/form", 312519)</script>
            (window as any).Widget("https://pos.gosuslugi.ru/form", 312519)
        })

        return () => {
            mount = false
        }
    }, [])

    return (
        <InnerHTML html={getCode()} />
    )
}

