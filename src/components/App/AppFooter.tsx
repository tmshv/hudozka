import { Footer } from '../Footer'
import { useContext } from 'react'
import { ConfigContext } from 'src/context/ConfigContext'

export type AppFooterProps = {
    showAuthor: boolean
}

export const AppFooter: React.FC<AppFooterProps> = props => {
    const config = useContext(ConfigContext)

    return (
        <Footer
            showAuthor={props.showAuthor}
            address={config.address}
            telephone={config.telephone}
            email={config.email}
        />
    )
}
