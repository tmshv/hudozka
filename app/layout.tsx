import "src/style/style.css"
import "src/style/content.css"
import "src/style/article.css"
import "src/style/marker/marker-table.css"
import "src/style/kazimir/video.css"

import type { Metadata, Viewport } from "next"
import Script from "next/script"
import { Roboto } from "next/font/google"
import { Providers } from "@/components/Providers"
import { YMetrika } from "@/components/YMetrika"
import { getMenu } from "@/remote/api"

const roboto = Roboto({
    weight: ["300", "900"],
    subsets: ["cyrillic", "latin"],
    display: "swap",
})

export const metadata: Metadata = {
    verification: {
        google: [
            "8BxOTw-Q02DS2KAdcGcnIMwiPZ58DVB18XpOfRibCcg",
            "A-TEemUw4hHpULUDCd6xhxfHnyRbgKtss90JGKXnSpw",
        ],
        other: {
            "yandex-verification": "643c7dac144b9dac",
            "msvalidate.01": "E878301FE3E3F12D233A6B1156889601",
            "proculture-verification": "79110940fd847c3cfe52392ed68f3210",
        },
    },
    icons: {
        icon: { url: "/static/graphics/favicon-32.png", type: "image/png" },
        apple: [
            { url: "/static/graphics/favicon-57.png", sizes: "57x57" },
            { url: "/static/graphics/favicon-72.png", sizes: "72x72" },
            { url: "/static/graphics/favicon-114.png", sizes: "114x114" },
            { url: "/static/graphics/favicon-144.png", sizes: "144x144" },
        ],
    },
    other: {
        "apple-mobile-web-app-capable": "yes",
        "referrer": "unsafe-url",
    },
    alternates: {
        types: {
            "application/feed+json": "/feed.json",
        },
    },
}

export const viewport: Viewport = {
    width: "device-width",
    maximumScale: 1,
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "hsl(240, 10%, 10%)" },
    ],
}

export const revalidate = 30

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const menu = await getMenu()

    return (
        <html lang="ru" className={roboto.className}>
            <head>
                {process.env.NEXT_PUBLIC_YMETRIKA_ACCOUNT && (
                    <YMetrika account={Number(process.env.NEXT_PUBLIC_YMETRIKA_ACCOUNT)} />
                )}
            </head>
            <body>
                <Providers menu={menu}>
                    {children}
                </Providers>
                <Script src="https://culturaltracking.ru/static/js/spxl.js?pixelId=27154" data-pixel-id="27154" />
            </body>
        </html>
    )
}
