import s from "./contacts.module.css"

import Link from "next/link"
import { Title } from "@/ui/Title"
import { useSnapshot } from "valtio"
import { state } from "@/store/config"

export const Contacts: React.FC = props => {
    const { contacts } = useSnapshot(state)

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
