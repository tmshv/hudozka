import s from './contacts.module.css'

import { useContext } from 'react'
import { ConfigContext } from 'src/context/ConfigContext'
import Link from 'next/link'

export const Contacts: React.FC = props => {
    const { contacts } = useContext(ConfigContext)

    return (
        <>
            <strong className={s.strong}>Контактная информация</strong>

            {contacts.map((x, i) => (
                <p key={i} className={s.link}>
                    <Link href={x.value}>
                        <a >{x.title}</a>
                    </Link>
                </p>
            ))}
        </>
    )
}
