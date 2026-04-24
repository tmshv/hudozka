import s from "./contacts.module.css"

import Link from "next/link"
import { Title } from "@hudozka/ui"
import { contacts } from "@/const"

export const Contacts: React.FC = () => {
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
