import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
    return (
        <Html>
            <Head>
                {/* Google Fonts */}
                <link
                    href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;900&display=swap"
                    rel="preload"
                    as="style"
                />

            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
