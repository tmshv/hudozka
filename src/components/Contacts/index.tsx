import { useContext } from 'react'
import { ConfigContext } from 'src/context/ConfigContext'

export const Contacts: React.FC = props => {
    const { contacts } = useContext(ConfigContext)

    return (
        <>
            <style jsx>{`
                strong {
                    margin-bottom: var(--size-m);
                }

                p {
                    margin-bottom: var(--size-s);
                }
            `}</style>

            <strong>Контактная информация</strong>

            {contacts.map((x, i) => (
                <p key={i}><a href={x.value}>{x.title}</a></p>
            ))}
        </>
    )
}
