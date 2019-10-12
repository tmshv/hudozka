import React from 'react'
import axios from 'axios'
import Head from 'next/head'
import { App } from '../../src/components/App'
import Page from '../../src/components/Page'
import { Meta } from '../../src/components/Meta'
import menuModel from '../../src/models/menu'
import { buildMenu } from '../../src/lib/menu'
import { meta } from '../../src/lib/meta'
import { createApiUrl, requestGet } from '../../src/next-lib'

const Index = (props) => (
    <App
        menu={buildMenu(props.pageUrl, menuModel)}
        showAuthor={true}
        menuPadding={true}
    >
        <Head>
            <title>{props.title}</title>
            <Meta meta={props.meta} />
        </Head>
        <div className="content content_thin">
            <Page shareable={true}>
                {props.person.post}
            </Page>
        </div>
    </App>
)

Index.getInitialProps = async (ctx) => {
    const pageUrl = '/collective'
    const id = ctx.query.person
    const person = await requestGet(createApiUrl(ctx.req, `/api/persons/${id}`), {})
    const name = person.name || []
    const title = name.join(' ')
    const image = person.preview ? person.preview.artifacts.fb : {}

    return {
        pageUrl,
        person,
        title,
        meta: meta({
            title,
            image: image.src,
            imageWidth: image.width,
            imageHeight: image.height,
        })
    }
}

export default Index