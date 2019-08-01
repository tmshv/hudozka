import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'

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

                    <script src='/static/likely.js'></script>
                    <link href='/static/likely.css' rel='stylesheet' />
                </Head>

                <body className="custom_class">
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
