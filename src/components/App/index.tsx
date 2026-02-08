import { Wrapper } from "../Wrapper"
import { MenuContext } from "@/context/MenuContext"
import { Footer } from "../Footer"
import { Content } from "../Content"
import { Breadcrumbs } from "../Breadcrumbs"
import { BreadcrumbPart, MenuItem } from "@/types"
import { useRouter } from "next/router"
import { useMobile } from "@/hooks/useMobile"
import { Navigation } from "@/components/Navigation"
import { Box } from "@/ui/Box"
import { AccessibilityButton } from "../AccessibilityButton"
import Copyright from "@/components/Copyright"
import { Spacer } from "../Spacer"
import { Author } from "../Author"
import { Title } from "@/ui/Title"
import { Panel } from "@/ui/Panel"
import { Contacts } from "../Contacts"
import dynamic from "next/dynamic"
import Link from "next/link"

import Image from "next/image"
import AccessibilityPanel from "../AccessibilityPanel"
import useAccessibility from "@/hooks/useAccessibility"

const Gosuslugi = dynamic(import("../Gosuslugi").then(module => module.Gosuslugi), {
    ssr: false,
})

export type AppProps = {
    showAuthor?: boolean
    contentStyle?: React.CSSProperties
    breadcrumbs?: BreadcrumbPart[]
    menu: MenuItem[]
    children?: React.ReactNode
}

export const App: React.FC<AppProps> = ({ showAuthor = false, menu, ...props }) => {
    const hideBreadcrumbs = useMobile()
    const accessibility = useAccessibility()
    const router = useRouter()
    const blockStyle = {
        justifyContent: "center",
    }

    return (
        <MenuContext.Provider value={menu}>
            <Wrapper
                header={(
                    <header>
                        {!accessibility ? null : (
                            <AccessibilityPanel/>
                        )}

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
                        <Box wrap gap={40} align={false} style={{
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
                                    Анкеты
                                </Title>

                                <ul>
                                    <li>
                                        <Link href={"https://bus.gov.ru/qrcode/rate/351942"}>
                                            Независимая оценка качества оказания услуг
                                        </Link>
                                    </li>

                                    <li>
                                        <Link href={"https://forms.mkrf.ru/e/2579/xTPLeBU7/?ap_orgcode=600340071"}>
                                            Анкета Министерства культуры РФ
                                        </Link>
                                    </li>

                                    <li>
                                        <Link href={"https://forms.yandex.ru/u/68ef8e9c90fa7b0bacf46e9d/"}>
                                            Анкета получателей образовательных услуг ДОП Кировского муниципального района Ленинградской области 2025
                                        </Link>
                                    </li>
                                </ul>
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
        </MenuContext.Provider>
    )
}
