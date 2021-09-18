import Head from 'next/head'
import { App } from 'src/components/App'
import { File } from 'src/components/File'
import { Share } from 'src/components/Share'
import { MetaBuilder } from 'src/lib/meta'
import { Meta } from 'src/components/Meta'
import { createApiUrl, requestGet, IResponseItems, apiGet } from 'src/next-lib'
import { InferGetStaticPropsType, NextPage } from 'next'
import { FileDefinition } from 'src/types'
import { createMenu } from '@/remote/factory'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const Index: NextPage<Props> = props => {
    if (!props.data) {
        console.log('document kek error', props)

        return null
    }

    return (
        <App
            showAuthor={true}
            menu={props.menu}
        >
            <Head>
                <title>{props.data.name}</title>
                <Meta meta={props.meta} />
            </Head>
            <File
                {...props.data}
                style={{
                    marginTop: 'var(--size-l)',
                }}
            />
            <Share />
        </App>
    )
}

export const getStaticProps = async (ctx: any) => {
    const slug = ctx.params.slug
    const data = await requestGet<FileDefinition>(createApiUrl(`/api/files/${slug}`), null)
    const meta = (new MetaBuilder())
        .setImage(data.cover)
        .setTitle(data.name)
        .setDescription(data.name)
        .build()
    const menu = await apiGet(createMenu)('https://hudozka.tmshv.com/menu', [])

    return {
        props: {
            data,
            meta,
            menu,
        }
    }
}

export const getStaticPaths = async () => {
    const urls = await requestGet<IResponseItems<string>>(createApiUrl(`/api/files/urls`), null)
    if (!urls) {
        return null
    }

    return {
        fallback: false,
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

export default Index
