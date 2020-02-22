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
    showAuthor: boolean
    wide?: boolean
    contentStyle?: React.CSSProperties
}

export const App: React.FC<IAppProps> = ({ wide = false, ...props }) => {
    const motionDisabled = useReducedMotion()

    return (
        <ConfigContext.Provider value={config}>
            <Wrapper
                header={(
                    <Header>
                        <Navigation />
                    </Header>
                )}
                footer={(
                    <Footer
                        showAuthor={props.showAuthor}
                    />
                )}
            >
                <div
                    className={cx('content', {
                        'reduced-motion': motionDisabled,
                        'content_wide': wide,
                    })}
                    style={props.contentStyle}
                >
                    {props.children}
                </div>

                {/* <Comments /> */}
            </Wrapper>
        </ConfigContext.Provider>
    )
}
