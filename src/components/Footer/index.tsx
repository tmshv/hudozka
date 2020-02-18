import { Copyright } from '../Copyright'
import { Author } from './Author'
import { Block } from '../Block'
import { Spacer } from '../Spacer'
import { Contacts } from '../Contacts'

export interface IFooterProps {
    showAuthor: boolean
}

export const Footer: React.FC<IFooterProps> = props => (
    <footer className={'opposite'}>
        <Block direction={'vertical'} style={{
            marginBottom: 'var(--single-margin)',
        }}>
            <Contacts />
        </Block>

        <Block direction={'horizontal'}>
            <Copyright />

            {!props.showAuthor ? null : (
                <>
                    <Spacer as={'span'} />
                    <Author />
                </>
            )}
        </Block>
    </footer >
)

