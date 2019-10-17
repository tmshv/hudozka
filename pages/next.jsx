import React from 'react'
import Head from 'next/head'

import { App } from '../src/components/App'
import { Page } from '../src/components/Page'
import menuModel from '../src/models/menu'
import { buildMenu } from '../src/lib/menu'
import { Meta } from '../src/components/Meta'
import { meta } from '../src/lib/meta'
import { createApiUrl, requestGet, wrapInitialProps } from '../src/next-lib'

const Index = (props) => (
    <App
        menu={buildMenu(props.pageUrl, menuModel)}
        showAuthor={true}
        menuPadding={true}
        layout={'thin'}
    >
        <Head>
            <title>{props.title}</title>
            <Meta meta={props.meta} />
        </Head>

        <Page
            showSocialShare={true}
        >
            {props.content}
        </Page>
    </App>
)

Index.getInitialProps = wrapInitialProps(async (ctx) => {
    const pageUrl = ctx.req.url
    // // const pageUrl = '/neighbors/2018'
    const page = await requestGet(createApiUrl(ctx.req, `/api/page?page=${pageUrl}`), {})
    const image = page.preview ? page.preview.artifacts.fb : {}

    return {
        content: page.data,
        pageUrl,
        title: page.title,
        meta: meta({
            title: page.title,
            image: image.src,
            imageWidth: image.width,
            imageHeight: image.height,
        }),
    }
})

export default Index