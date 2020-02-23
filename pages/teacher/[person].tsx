import Head from 'next/head'
import { App } from 'src/components/App'
import { Article } from 'src/components/Article'
import { Meta } from 'src/components/Meta'
import { MetaBuilder } from 'src/lib/meta'
import { createApiUrl, requestGet, IResponseItems } from 'src/next-lib'
import { NextPage } from 'next'
import { IMeta } from 'src/types'
import { Html } from 'src/components/Html'

interface IProps {
    title: string
    meta: IMeta
    person: any
}

const Index: NextPage<IProps> = props => {
    if (!props?.person?.post) {
        console.log('kek error', props)

        return null
    }

    return (
        <App
            showAuthor={true}
        >
            <Head>
                <title>{props.title}</title>
                <Meta meta={props.meta} />
            </Head>

            {!props.person.post ? null : (
                <Article
                    title={''}
                    tags={[]}
                    date={null}
                    shareable={true}
                >
                    <Html
                        html={props.person.post}
                    />
                </Article>
            )}
        </App>
    )
}

export const unstable_getStaticProps = async (ctx: any) => {
    const id = ctx.params.person 
    if (!id) {
        throw new Error('sry')
    }

    const person = await requestGet<any>(createApiUrl(`/api/persons/${id}`), null)
    const name = person.name || []
    const title = name.join(' ')
    const image = person.preview ? person.preview.artifacts.fb : {}

    if (!person?.post) {
        throw new Error(`post kek ${id}`)
    }

    const meta = (new MetaBuilder())
        .setData({
            title,
            image: image.src,
            imageWidth: image.width,
            imageHeight: image.height,
        })
        .setImage(person.preview)
        .setTitle(title)
        .setDescription(person.position)
        .build()

    return {
        props: {
            person,
            title,
            meta,
        }
    }
}

export const unstable_getStaticPaths = async () => {
    const urls = await requestGet<IResponseItems<string>>(createApiUrl(`/api/persons/urls`), null)

    return {
        paths: urls.items
            .map(x => x.replace('/teacher/', ''))
            .map(person => ({
                params: {
                    person,
                },
            })),
    }
}

export default Index
