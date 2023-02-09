import s from "./contacts.module.css"

import { useContext } from "react"
import { ConfigContext } from "src/context/ConfigContext"
import Link from "next/link"
import { Title } from "@/ui/Title"

export const Contacts: React.FC = props => {
    const { contacts } = useContext(ConfigContext)

    return (
        <>
            <Title level={3}>Контактная информация</Title>

            {contacts.map((x, i) => (
                <p key={i} className={s.link}>
                    <Link href={x.value}>
                        {x.title}
                    </Link>
                </p>
            ))}
        </>
    )
}
