import { useContext } from 'react'
import { ConfigContext } from 'src/context/ConfigContext'

export const Contacts: React.FC = props => {
    const { contacts } = useContext(ConfigContext)

    return (
        <>
            <style jsx>{`
                h4 {
                    margin-bottom: var(--size-s);
                }

                p {
                    margin-left: var(--size-m);
                    margin-bottom: var(--size-s);
                }
            `}</style>

            <h4>Контактная информация</h4>

            {contacts.map((x, i) => (
                <p key={i}><a href={x.value}>{x.title}</a></p>
            ))}
        </>
    )
}
