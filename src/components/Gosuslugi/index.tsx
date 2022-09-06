import { useEffect } from "react"
import { getCode } from "./lib"

export type GosuslugiProps = {}

export const Gosuslugi: React.FC<GosuslugiProps> = () => {
    useEffect(() => {
        window.dispatchEvent(new Event("resize"))
    })

    return (
        <div dangerouslySetInnerHTML={{ __html: getCode() }} />
    )
}
