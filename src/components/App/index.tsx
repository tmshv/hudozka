import { Wrapper } from "../Wrapper"
import { ConfigContext } from "src/context/ConfigContext"
import config from "src/config"
import { Footer } from "../Footer"
import { Content } from "../Content"
import { Breadcrumbs } from "../Breadcrumbs"
import { IBreadcumbsPart, IMenu } from "src/types"
import { useRouter } from "next/router"
import { useMobile } from "src/hooks/useMobile"
import { Navigation } from "@/components/Navigation"
import { Box } from "@/ui/Box"
import { Button } from "@/ui/Button"
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons"
import { useTheme } from "@/ui/theme/useTheme"
import { Copyright } from "../Copyright"
import { Spacer } from "../Spacer"
import { Author } from "../Author"
import { Title } from "@/ui/Title"
import { Panel } from "@/ui/Panel"
import { Contacts } from "../Contacts"
import dynamic from "next/dynamic"

const Gosuslugi = dynamic(import("../Gosuslugi").then(module => module.Gosuslugi), {
    ssr: false,
})

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
    const { theme, setTheme } = useTheme()

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
                    <Footer>
                        <Box gap={40} align={false} style={{
                            marginBottom: "var(--size-l)",
                        }}>
                            <Panel ghost>
                                <Contacts />
                            </Panel>

                            <Panel ghost style={{
                                alignItems: "baseline",
                            }}>
                                <Title level={3}>
                                    Версия для слабовидящих
                                </Title>
                                <Button theme="icon" size="default" onClick={() => {
                                    setTheme(theme === "default" ? "contrast" : "default")
                                }}>
                                    {theme === "default" ? (
                                        <EyeOpenIcon width={24} height={24} />
                                    ) : (
                                        <EyeClosedIcon width={24} height={24} />
                                    )}
                                </Button>
                            </Panel>
                        </Box>

                        <div style={{
                            backgroundColor: "white",
                            padding: 10,
                            borderRadius: 10,
                            marginBottom: 30,
                        }}>
                            <Gosuslugi />
                        </div>


                        <Box>
                            <Copyright />

                            {!showAuthor ? null : (
                                <>
                                    <Spacer as={"span"} />
                                    <Author />
                                </>
                            )}
                        </Box>
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
