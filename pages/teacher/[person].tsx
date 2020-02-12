import Head from 'next/head'
import { App } from 'src/components/App'
import Article from 'src/components/Article'
import { Meta } from 'src/components/Meta'
import menuModel from 'src/models/menu'
import { buildMenu } from 'src/lib/menu'
import { meta } from 'src/lib/meta'
import { createApiUrl, requestGet, wrapInitialProps } from 'src/next-lib'
import { NextPage } from 'next'
import { IMeta } from 'src/types'
import Html from 'src/components/Html'

interface IProps {
    pageUrl: string
    title: string
    meta: IMeta
    person: any
}

const Index: NextPage<IProps> = props => (
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
    </App>
)

Index.getInitialProps = wrapInitialProps(async (ctx) => {
    const pageUrl = '/collective'
    const id = ctx.query.person
    const person: any = await requestGet(createApiUrl(ctx.req, `/api/persons/${id}`), {})
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
})

export default Index
