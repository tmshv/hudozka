import Head from 'next/head'
import { App } from 'src/components/App'
import { Article } from 'src/components/Article'
import { Meta } from 'src/components/Meta'
import { MetaBuilder } from 'src/lib/meta'
import { createApiUrl, requestGet, IResponseItems } from 'src/next-lib'
import { NextPage } from 'next'
import { IMeta, ImageArtifact, ImageDefinition } from 'src/types'
import { Html } from 'src/components/Html'

type Person = {
    id: string
    position: string
    name: [string, string, string]
    post: string
    diploma: string
    edu: string
    file: string
    hash: string
    shortName: string
    status: string
    url: string
    picture: ImageArtifact
    preview: ImageDefinition
}

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

    const person = await requestGet<Person>(createApiUrl(`/api/persons/${id}`), null)
    if (!person?.post) {
        throw new Error(`post kek ${id}`)
    }

    const title = person.name.join(' ')
    const meta = (new MetaBuilder())
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
