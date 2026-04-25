import { Title } from "@hudozka/ui"

import Link from "next/link"
import { contacts } from "@/const"
import s from "./contacts.module.css"

export function Contacts() {
    return (
        <>
            <Title level={3}>Контактная информация</Title>

            {contacts.map(x => (
                <p key={x.value} className={s.link}>
                    <Link href={x.value}>{x.title}</Link>
                </p>
            ))}
        </>
    )
}
