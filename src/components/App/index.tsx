import dynamic from 'next/dynamic'
import { Wrapper } from '../Wrapper'
import { ConfigContext } from 'src/context/ConfigContext'
import config from 'src/config'
import { Footer } from '../Footer'
import { Content } from '../Content'
import { Block } from '../Block'
import { Breadcrumbs } from '../Breadcrumbs'
import { IBreadcumbsPart } from 'src/types'
import { useRouter } from 'next/router'
import { useMobile } from 'src/hooks/useMobile'

const Navigation = dynamic(() => import('../Navigation').then(mod => mod.Navigation), {
    ssr: false,
})

export interface IAppProps {
    showAuthor?: boolean
    wide?: boolean
    contentStyle?: React.CSSProperties
    breadcrumbs?: IBreadcumbsPart[]
}

export const App: React.FC<IAppProps> = ({ showAuthor = false, wide = false, ...props }) => {
    const hideBreadcrumbs = useMobile()
    const router = useRouter()
    const blockStyle = {
        justifyContent: 'center'
    }

    return (
        <ConfigContext.Provider value={config}>
            <Wrapper
                header={(
                    <header>
                        <Navigation style={{
                            margin: '0 var(--size-m) var(--size-m)',
                        }} />
                        {hideBreadcrumbs || !props.breadcrumbs ? null : (
                            <Block direction={'horizontal'} style={blockStyle}>
                                <Content wide={wide}>
                                    <Breadcrumbs
                                        items={props.breadcrumbs}
                                        path={router.asPath}
                                    />
                                </Content>
                            </Block>
                        )}
                    </header>
                )}
                footer={(
                    <Footer
                        showAuthor={showAuthor}
                    />
                )}
            >
                <Block direction={'horizontal'} style={blockStyle}>
                    <Content wide={wide} style={props.contentStyle}>
                        {props.children}
                    </Content>
                </Block>
            </Wrapper>
        </ConfigContext.Provider>
    )
}
