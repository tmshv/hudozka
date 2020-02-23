import dynamic from 'next/dynamic'
import Comments from '../Comments'
import { Wrapper } from '../Wrapper'
import { ConfigContext } from 'src/context/ConfigContext'
import config from 'src/config'
import { Footer } from '../Footer'
import { Content } from '../Content'
import { Block } from '../Block'
import { Breadcrumbs } from '../Breadcrumbs'
import { IBreadcumbsPart } from 'src/types'
import { useRouter } from 'next/router'
import { route } from 'next/dist/next-server/server/router'

const Navigation = dynamic(() => import('../Navigation').then(mod => mod.Navigation), {
    ssr: false,
})

export interface IAppProps {
    showAuthor: boolean
    wide?: boolean
    contentStyle?: React.CSSProperties
    breadcrumbs?: IBreadcumbsPart[]
}

export const App: React.FC<IAppProps> = props => {
    const router = useRouter()
    const wide = props.wide ?? false
    const blockStyle = {
        alignItems: 'center'
    }

    return (
        <ConfigContext.Provider value={config}>
            <Wrapper
                header={(
                    <header>
                        <Navigation />
                        {!props.breadcrumbs ? null : (
                            <Block direction={'vertical'} style={blockStyle}>
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
                        showAuthor={props.showAuthor}
                    />
                )}
            >
                <Block direction={'vertical'} style={blockStyle}>
                    <Content wide={wide} style={props.contentStyle}>
                        {props.children}
                    </Content>
                </Block>

                {/* <Comments /> */}
            </Wrapper>
        </ConfigContext.Provider>
    )
}
