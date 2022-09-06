import { useContext } from "react"
import { ConfigContext } from "src/context/ConfigContext"

export const Copyright: React.FC = () => {
    const { yearStart, yearEnd } = useContext(ConfigContext)

    return (
        <span>©&nbsp;{yearStart}—{yearEnd} Шлиссельбургская детская художественная школа</span>
    )
}
