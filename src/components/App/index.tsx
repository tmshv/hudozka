import dynamic from 'next/dynamic'
import { Wrapper } from '../Wrapper'
import { ConfigContext } from 'src/context/ConfigContext'
import config from 'src/config'
import { Footer } from '../Footer'
import { Content } from '../Content'
import { Block } from '../Block'
import { Breadcrumbs } from '../Breadcrumbs'
import { IBreadcumbsPart, IMenu } from 'src/types'
import { useRouter } from 'next/router'
import { useMobile } from 'src/hooks/useMobile'
import { Gosuslugi } from '../Gosuslugi'
import { INavigationProps } from '@/components/Navigation'

const Navigation = dynamic<INavigationProps>(() => import('../Navigation').then(mod => mod.Navigation), {
    ssr: false,
})

export interface IAppProps {
    showAuthor?: boolean
    contentStyle?: React.CSSProperties
    breadcrumbs?: IBreadcumbsPart[]
    menu: IMenu[]
}

export const App: React.FC<IAppProps> = ({ showAuthor = false, menu, ...props }) => {
    const hideBreadcrumbs = useMobile()
    const router = useRouter()
    const blockStyle = {
        justifyContent: 'center',
    }

    return (
        <ConfigContext.Provider value={{
            ...config,
            menu,
        }}>
            <Wrapper
                header={(
                    <header>
                        <Navigation style={{
                            margin: '0 var(--size-m) var(--size-m)',
                        }} />
                        {hideBreadcrumbs || !props.breadcrumbs ? null : (
                            <Block direction={'horizontal'} style={blockStyle}>
                                <Content>
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
                    >
                        <div style={{
                            backgroundColor: 'white',
                            padding: 10,
                            borderRadius: 10,
                            marginBottom: 30,
                        }}>
                            <Gosuslugi />
                        </div>
                    </Footer>
                )}
            >
                <Block direction={'horizontal'} style={blockStyle}>
                    <Content style={props.contentStyle}>
                        {props.children}
                    </Content>
                </Block>
            </Wrapper>
        </ConfigContext.Provider>
    )
}
