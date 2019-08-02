import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { YMetrika } from '../src/components/YMetrika'

export default class MyDocument extends Document {
    // static async getInitialProps(ctx) {
    //     const initialProps = await Document.getInitialProps(ctx);
    //     return { ...initialProps };
    // }

    render() {
        return (
            <Html>
                <Head>
                    <style>{`body { margin: 0 } /* custom! */`}</style>

                    <meta charset="utf-8" />
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

                    {/* <link
                        rel="alternate"
                        type="application/rss+xml"
                        title="Шлиссельбургская Детская Художественная Школа"
                        href="/feed"
                    /> */}

                    {/* Fotorama + jQuery*/}
                    <link href="//cdnjs.cloudflare.com/ajax/libs/fotorama/4.6.4/fotorama.css" rel="stylesheet" />
                    <script src="//cdnjs.cloudflare.com/ajax/libs/fotorama/4.6.4/fotorama.js" />
                    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js" />

                    {/* Opa */}
                    <script src="/static/opa.js" />
                    <link rel="stylesheet" href="/static/opa.css" />

                    {/* Likely */}
                    <script src='/static/likely.js' />
                    <link href='/static/likely.css' rel='stylesheet' />

                    {/* Fonts */}
                    <link href="https://fonts.googleapis.com/css?family=PT+Sans|PT+Serif" rel="stylesheet" as="font" />

                    {/* Instagram Embed */}
                    <script async defer src="//platform.instagram.com/en_US/embeds.js" />

                    <YMetrika account={24027460}/>
                </Head>

                <body className="custom_class">
                    <Main />
                    <NextScript />

                    <script src="/static/app.js" />
                </body>
            </Html>
        );
    }
}
