import dynamic from 'next/dynamic'
import cx from 'classnames'
import Comments from '../Comments'
import { useReducedMotion } from 'src/hooks/useReducedMotion'
import { Wrapper } from '../Wrapper'
import { Header } from './Header'
import { ConfigContext } from 'src/context/ConfigContext'
import config from 'src/config'
import { AppFooter } from './AppFooter'

const Navigation = dynamic(() => import('../Navigation').then(mod => mod.Navigation), {
    ssr: false,
})

export interface IAppProps {
    menu: any
    showAuthor: boolean
    menuPadding: boolean
    layout: 'full' | 'wide' | 'thin'
}

export const App: React.FC<IAppProps> = props => {
    const motionDisabled = useReducedMotion()

    return (
        <ConfigContext.Provider value={config}>
            <Wrapper
                header={(
                    <Header>
                        <Navigation
                            items={props.menu.items}
                        />
                    </Header>
                )}
                footer={(
                    <AppFooter
                        showAuthor={props.showAuthor}
                    />
                )}
            >
                <section className={cx('content', `content_${props.layout}`, {
                    'content--padding-top--menu': props.menuPadding,
                    'reduced-motion': motionDisabled,
                })}>
                    {props.children}
                </section>

                <Comments />
            </Wrapper>
        </ConfigContext.Provider>
    )
}
