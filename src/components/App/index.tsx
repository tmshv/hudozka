"use client"

import s from "./app.module.css"

import { useContext } from "react"
import { Wrapper } from "../Wrapper"
import { MenuContext } from "@/context/MenuContext"
import { Footer } from "../Footer"
import { Content } from "../Content"
import { Breadcrumbs } from "../Breadcrumbs"
import type { BreadcrumbPart } from "@/types"
import { usePathname } from "next/navigation"
import { useMobile } from "@/hooks/useMobile"
import { Navigation } from "@/components/Navigation"
import { Box } from "@/ui/Box"
import { AccessibilityButton } from "../AccessibilityButton"
import { Copyright } from "@/components/Copyright"
import { yearRange } from "@/const"
import { Spacer } from "../Spacer"
import { Author } from "../Author"
import { Title } from "@/ui/Title"
import { Panel } from "@/ui/Panel"
import { Contacts } from "../Contacts"
import dynamic from "next/dynamic"
import Link from "next/link"

import AccessibilityPanel from "../AccessibilityPanel"
import useAccessibility from "@/hooks/useAccessibility"

const Gosuslugi = dynamic(() => import("../Gosuslugi").then(module => ({ default: module.Gosuslugi })), {
    ssr: false,
})

export type AppProps = {
    showAuthor?: boolean
    contentStyle?: React.CSSProperties
    breadcrumbs?: BreadcrumbPart[]
    children?: React.ReactNode
}

export function App({ showAuthor = false, ...props }: AppProps) {
    const hideBreadcrumbs = useMobile()
    const accessibility = useAccessibility()
    const pathname = usePathname()
    const menu = useContext(MenuContext)

    return (
        <Wrapper
            header={(
                <header>
                    {!accessibility ? null : (
                        <AccessibilityPanel/>
                    )}

                    <div className={s.navigation}>
                        <Navigation />
                    </div>
                    {hideBreadcrumbs || !props.breadcrumbs ? null : (
                        <Box center>
                            <Content>
                                <Breadcrumbs
                                    items={props.breadcrumbs}
                                    path={pathname}
                                />
                            </Content>
                        </Box>
                    )}
                </header>
            )}
            footer={(
                <Footer>
                    <Box wrap gap={40} align={false} className={s.footerLinks}>
                        <Panel ghost>
                            <Contacts />
                        </Panel>

                        <Panel ghost className={s.footerPanel}>
                            <Title level={3}>
                                Версия для слабовидящих
                            </Title>
                            <AccessibilityButton />
                        </Panel>

                        <Panel ghost className={s.footerPanel}>
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

                    <div className={s.gosuslugi}>
                        <Gosuslugi />
                    </div>

                    <Box>
                        <Copyright years={yearRange} />

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
            <Box center>
                <Content style={props.contentStyle}>
                    {props.children}
                </Content>
            </Box>
        </Wrapper>
    )
}
