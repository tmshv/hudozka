import React from 'react'
import Head from 'next/head'
import { App } from 'src/components/App'
import Document from 'src/components/Document'
import { Share } from 'src/components/Share'
import { meta } from 'src/lib/meta'
import { Meta } from 'src/components/Meta'
import { createApiUrl, requestGet, IResponseItems } from 'src/next-lib'
import { NextPage } from 'next'
import { IMeta } from 'src/types'

type Props = {
    data: any //(file)
    meta: IMeta
}

const Page: NextPage<Props> = props => {
    if (!props.data) {
        console.log('kek error', props)

        return null
    }

    return (
        <App
            showAuthor={true}
        >
            <Head>
                <title>{props.data.title}</title>
                <Meta meta={props.meta} />
            </Head>
            <Document {...props.data} />
            <Share />
        </App>
    )
}

export const unstable_getStaticProps = async (ctx: any) => {
    const id = ctx.params.slug
    const data = await requestGet(createApiUrl(`/api/files/${id}`), {})

    return {
        props: {
            data,
            meta: meta({
                // title: file.meta,
            })
        }
    }
}

export const unstable_getStaticPaths = async () => {
    const urls = await requestGet<IResponseItems<string>>(createApiUrl(`/api/files/urls`), null)
    if (!urls) {
        return null
    }

    return {
        paths: urls.items
            .map(x => x.replace('/document/', ''))
            .map(slug => {
                return {
                    params: {
                        slug,
                    },
                }
            }),
    }
}

export default Page
