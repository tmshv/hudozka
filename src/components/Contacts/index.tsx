import { useContext } from 'react'
import { ConfigContext } from 'src/context/ConfigContext'

export const Contacts: React.FC = props => {
    const { contacts } = useContext(ConfigContext)

    return (
        <>
            <style jsx>{`
                h4 {
                    margin-bottom: var(--half-margin);
                }

                p {
                    margin-left: var(--single-margin);
                    margin-bottom: var(--half-margin);
                }
            `}</style>

            <h4>Контактная информация</h4>

            {contacts.map((x, i) => (
                <p><a href={x.value}>{x.title}</a></p>
            ))}
        </>
    )
}
