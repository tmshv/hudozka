import 'src/style.css'
import 'src/style/content.css'
import 'src/style/kazimir/image.css'
import 'src/style/kazimir/video.css'
import 'src/style/style.scss'

import App from 'next/app'
import Head from 'next/head'
import { YMetrika } from 'src/components/YMetrika'
import { GAnalytics } from 'src/components/GAnalytics'

export default class MyApp extends App {
    render() {
        const { Component, pageProps } = this.props

        return (
            <>
                <Head>
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="width=device-width, maximum-scale=1.0" />
                    <meta name="referrer" content="unsafe-url" />

                    <meta name="google-site-verification" content="8BxOTw-Q02DS2KAdcGcnIMwiPZ58DVB18XpOfRibCcg" />
                    <meta name="google-site-verification" content="A-TEemUw4hHpULUDCd6xhxfHnyRbgKtss90JGKXnSpw" />
                    <meta name='yandex-verification' content='643c7dac144b9dac' />
                    <meta name="msvalidate.01" content="E878301FE3E3F12D233A6B1156889601" />

                    <link rel="icon" type="image/png" href="/static/graphics/favicon-32.png" />
                    <link rel="apple-touch-icon" sizes="57x57" href="/static/graphics/favicon-57.png" />
                    <link rel="apple-touch-icon" sizes="72x72" href="/static/graphics/favicon-72.png" />
                    <link rel="apple-touch-icon" sizes="114x114" href="/static/graphics/favicon-114.png" />
                    <link rel="apple-touch-icon" sizes="144x144" href="/static/graphics/favicon-144.png" />

                    <link
                        rel="alternate"
                        type="application/rss+xml"
                        title="Шлиссельбургская Детская Художественная Школа"
                        href="/feed.xml"
                    />

                    <link href='/static/shadow-font/style.css' rel='stylesheet' />

                    {/* Fotorama + jQuery*/}
                    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js" />
                    <link href="//cdnjs.cloudflare.com/ajax/libs/fotorama/4.6.4/fotorama.css" rel="stylesheet" />
                    <script src="//cdnjs.cloudflare.com/ajax/libs/fotorama/4.6.4/fotorama.js" />

                    {/* Opa */}
                    <script src="/static/opa.js" />
                    <link rel="stylesheet" href="/static/opa.css" />

                    {/* Likely */}
                    <script src='/static/likely.js' />
                    <link href='/static/likely.css' rel='stylesheet' />

                    {/* Instagram Embed */}
                    <script async defer src="//platform.instagram.com/en_US/embeds.js" />

                    <YMetrika account={24027460} />
                    <GAnalytics account={'UA-60209057-1'} />
                </Head>
                <Component {...pageProps} />
            </>
        )
    }
}
