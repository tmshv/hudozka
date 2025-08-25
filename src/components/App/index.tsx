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
import { AccessibilityButton } from "../AccessibilityButton"
import { Copyright } from "../Copyright"
import { Spacer } from "../Spacer"
import { Author } from "../Author"
import { Title } from "@/ui/Title"
import { Panel } from "@/ui/Panel"
import { Contacts } from "../Contacts"
import dynamic from "next/dynamic"

import qr0 from "src/assets/qr00.png"
import qr1 from "src/assets/qr01.png"
import Image from "next/image"
import AccessibilityPanel from "../AccessibilityPanel"

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

    return (
        <ConfigContext.Provider value={{
            ...config,
            menu,
        }}>
            <Wrapper
                header={(
                    <header>
                        <Navigation style={{
                            padding: "var(--size-s)",
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
                                <AccessibilityButton />
                            </Panel>

                            <Panel ghost style={{
                                alignItems: "baseline",
                            }}>
                                <Title level={3}>
                                    Независимая оценка качества оказания услуг
                                </Title>
                                <div style={{
                                    backgroundColor: "white",
                                    padding: 10,
                                    borderRadius: 10,
                                }}>
                                    <Image
                                        src={qr0}
                                        alt="Example Image"
                                        width={100}
                                        height={100}
                                    />
                                </div>
                            </Panel>
                            <Panel ghost style={{
                                alignItems: "baseline",
                            }}>
                                <Title level={3}>
                                    Анкета Министерства культуры РФ
                                </Title>
                                <div style={{
                                    backgroundColor: "white",
                                    padding: 10,
                                    borderRadius: 10,
                                }}>
                                    <Image
                                        src={qr1}
                                        alt="Example Image"
                                        width={100}
                                        height={100}
                                    />
                                </div>
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
                <AccessibilityPanel/>

                <Box style={blockStyle}>
                    <Content style={props.contentStyle}>
                        {props.children}
                    </Content>
                </Box>
            </Wrapper>
        </ConfigContext.Provider>
    )
}
