import React from 'react'
import Head from 'next/head'
import { App } from '../../src/components/App'
import Document from '../../src/components/Document'
import Share from '../../src/components/Share'
import menuModel from '../../src/models/menu'
import { buildMenu } from '../../src/lib/menu'
import { meta } from '../../src/lib/meta'
import { Meta } from '../../src/components/Meta'
import { createApiUrl, requestGet, wrapInitialProps } from '../../src/next-lib'

const Page = (props) => (
    <App
        menu={buildMenu(props.pageUrl, menuModel)}
        showAuthor={true}
        menuPadding={true}
    >
        <Head>
            <title>{props.file.title}</title>
            <Meta meta={props.meta} />
        </Head>
        <div className="content content_wide">
            <Document {...props.file} />
            <Share />
        </div>
    </App>
)

Page.getInitialProps = wrapInitialProps(async (ctx) => {
    const pageUrl = '/documents'
    const id = ctx.query.document
    const file = await requestGet(createApiUrl(ctx.req, `/api/files/${id}`), {})

    return {
        file,
        pageUrl,
        meta: meta({
            title: file.meta,
        })
    }
})

export default Page