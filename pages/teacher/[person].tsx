import Head from 'next/head'
import { App } from 'src/components/App'
import Article from 'src/components/Article'
import { Meta } from 'src/components/Meta'
import menuModel from 'src/models/menu'
import { buildMenu } from 'src/lib/menu'
import { meta } from 'src/lib/meta'
import { createApiUrl, requestGet, IResponseItems } from 'src/next-lib'
import { NextPage, NextPageContext } from 'next'
import { IMeta } from 'src/types'
import Html from 'src/components/Html'

interface IProps {
    pageUrl: string
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
            menu={buildMenu(props.pageUrl, menuModel)}
            showAuthor={true}
            menuPadding={true}
            layout={'thin'}
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
    console.log('call unstable_getStaticProps', ctx)

    const pageUrl = '/collective'
    // const id = ctx.query.person
    // const id = ctx.params.person ?? 'va-sarzhin'
    const id = ctx.params.person //?? 'mg-timasheva'

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

    return {
        props: {
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
}

export const unstable_getStaticPaths = async () => {
    console.log('call unstable_getStaticPaths')

    const urls = await requestGet<IResponseItems<string>>(createApiUrl(`/api/persons/urls`), null)
    // const urls = {items: ['/teacher/va-sarzhin']}

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
