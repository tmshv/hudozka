import dynamic from 'next/dynamic'
import cx from 'classnames'
import Comments from '../Comments'
import { useReducedMotion } from 'src/hooks/useReducedMotion'
import { Wrapper } from '../Wrapper'
import { Header } from './Header'
import { ConfigContext } from 'src/context/ConfigContext'
import config from 'src/config'
import { Footer } from '../Footer'

const Navigation = dynamic(() => import('../Navigation').then(mod => mod.Navigation), {
    ssr: false,
})

export interface IAppProps {
    menu: any
    showAuthor: boolean
    layout: 'full' | 'wide'
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
                    <Footer
                        showAuthor={props.showAuthor}
                    />
                )}
            >
                <div
                    className={cx('content', `content_${props.layout}`, {
                        'reduced-motion': motionDisabled,
                    })}
                    style={{
                        paddingTop: 'var(--menu-thickness)'
                    }}
                >
                    {props.children}
                </div>

                {/* <Comments /> */}
            </Wrapper>
        </ConfigContext.Provider>
    )
}
