import { Wrapper } from "../Wrapper"
import { ConfigContext } from "src/context/ConfigContext"
import config from "src/config"
import { Footer } from "../Footer"
import { Content } from "../Content"
import { Breadcrumbs } from "../Breadcrumbs"
import { IBreadcumbsPart, IMenu } from "src/types"
import { useRouter } from "next/router"
import { useMobile } from "src/hooks/useMobile"
import { Gosuslugi } from "../Gosuslugi"
import { Navigation } from "@/components/Navigation"
import { Box } from "@/ui/Box"

export type AppProps = {
    showAuthor?: boolean
    contentStyle?: React.CSSProperties
    breadcrumbs?: IBreadcumbsPart[]
    menu: IMenu[]
    children?: React.ReactNode
}

export const App: React.FC<AppProps> = ({ showAuthor = false, menu, ...props }) => {
    const hideBreadcrumbs = useMobile()
    const router = useRouter()
    const blockStyle = {
        justifyContent: "center",
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
                            // margin: "0 var(--size-m) var(--size-m)",
                        }} />
                        {hideBreadcrumbs || !props.breadcrumbs ? null : (
                            <Box style={blockStyle}>
                                <Content>
                                    <Breadcrumbs
                                        items={props.breadcrumbs}
                                        path={router.asPath}
                                    />
                                </Content>
                            </Box>
                        )}
                    </header>
                )}
                footer={(
                    <Footer
                        showAuthor={showAuthor}
                    >
                        <div style={{
                            backgroundColor: "white",
                            padding: 10,
                            borderRadius: 10,
                            marginBottom: 30,
                        }}>
                            <Gosuslugi />
                        </div>
                    </Footer>
                )}
            >
                <Box style={blockStyle}>
                    <Content style={props.contentStyle}>
                        {props.children}
                    </Content>
                </Box>
            </Wrapper>
        </ConfigContext.Provider>
    )
}
