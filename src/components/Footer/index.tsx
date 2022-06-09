import s from './footer.module.css'

import cx from 'classnames'
import { Copyright } from '../Copyright'
import { Author } from './Author'
import { Block } from '../Block'
import { Spacer } from '../Spacer'
import { Contacts } from '../Contacts'

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

        {props.children}

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

