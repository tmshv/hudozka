import { state } from "@/store/config"
import { useSnapshot } from "valtio"

function Copyright() {
    const { years } = useSnapshot(state)
    const year = years.map(String).join("—")

    return (
        <span>©&nbsp;{year} Шлиссельбургская детская художественная школа</span>
    )
}

export default Copyright
