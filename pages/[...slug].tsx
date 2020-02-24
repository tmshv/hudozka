import Head from 'next/head'
import { App } from 'src/components/App'
import { tail } from 'lodash'
import { Page } from 'src/components/Page'
import { Meta } from 'src/components/Meta'
import { MetaBuilder } from 'src/lib/meta'
import { createApiUrl, requestGet, IResponseItems } from 'src/next-lib'
import { NextPage } from 'next'
import { IBreadcumbsPart, IMeta, IPage } from 'src/types'

function array<T>(value: T | T[]) {
    return Array.isArray(value)
        ? value
        : [value]
}

type Props = {
    title: string
    content: string
    breadcrumb: IBreadcumbsPart[]
    meta: IMeta
}

const Index: NextPage<Props> = props => (
    <App
        showAuthor={true}
        contentStyle={{
            marginTop: 'var(--size-l)'
        }}
        breadcrumbs={props.breadcrumb}
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

export const unstable_getStaticProps = async (ctx: any) => {
    let slug = null
    if (ctx.query) {
        slug = '/' + array(ctx.query.slug).join('/')
    } else {
        slug = '/' + array(ctx.params.slug).join('/')
    }
    const page = await requestGet<IPage>(createApiUrl(`/api/page?page=${slug}`), null)
    if (!page) {
        throw new Error(`Not found: ${slug}`)
    }
    const description = page.description ?? null
    const breadcrumbSize = page.breadcrumb?.length ?? 0
    const breadcrumb = breadcrumbSize < 2 ? null : page.breadcrumb

    const meta = (new MetaBuilder())
        .setImage(page.preview)
        .setTitle(page.title)
        .setDescription(description)
        .build()

    return {
        props: {
            content: page.data,
            title: page.title,
            meta,
            breadcrumb,
        }
    }
}

export const unstable_getStaticPaths = async () => {
    const urls = await requestGet<IResponseItems<string>>(createApiUrl(`/api/pages/urls`), null)
    if (!urls) {
        return null
    }

    return {
        paths: urls.items
            .map(path => {
                const slug = tail(path.split('/'))

                return {
                    params: {
                        slug,
                    },
                }
            }),
    }
}

export default Index
