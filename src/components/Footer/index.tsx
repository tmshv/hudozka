import s from './footer.module.css'

import cx from 'classnames'
import { Copyright } from '../Copyright'
import { Author } from './Author'
import { Block } from '../Block'
import { Spacer } from '../Spacer'
import { Contacts } from '../Contacts'
import { Gosuslugi } from '../Gosuslugi'

export interface IFooterProps {
    showAuthor: boolean
}

export const Footer: React.FC<IFooterProps> = props => (
    <footer className={cx(s.footer, 'opposite')}>
        <Block direction={'vertical'} style={{
            marginBottom: 'var(--size-l)',
        }}>
            <Contacts />
        </Block>

        <div style={{
            backgroundColor: 'white',
            padding: 10,
            borderRadius: 10,
            marginBottom: 10,
        }}>
            <Gosuslugi/>
        </div>

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

