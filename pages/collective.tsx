import Head from 'next/head'
import { get } from 'lodash'
import { App } from 'src/components/App'
import { Meta } from 'src/components/Meta'
import { CollectiveImage } from 'src/components/CollectiveImage'
import { PersonCard } from 'src/components/PersonCard'
import { CardList } from 'src/components/CardList'
import menuModel from 'src/models/menu'
import { buildMenu } from 'src/lib/menu'
import { meta } from 'src/lib/meta'
import { IMeta } from 'src/types'
import { createApiUrl, requestGet, wrapInitialProps, IResponseItems } from 'src/next-lib'
import { NextPage } from 'next'

interface IPerson {

}

type Props = {
    pageUrl: string
    title: string
    image: string
    meta: IMeta
    persons: IPerson[]
}

const Page: NextPage<Props> = props => (
    <App
        menu={buildMenu(props.pageUrl, menuModel)}
        showAuthor={true}
        menuPadding={true}
        layout={'wide'}
    >
        <Head>
            <title>{props.title}</title>
            <Meta meta={props.meta} />
        </Head>

        {!props.image ? null : (
            <CollectiveImage
                data={props.image}
                style={{
                    marginBottom: 'var(--double-margin)',
                }}
            />
        )}

        <CardList
            items={props.persons}
            renderItem={(person, index) => (
                <PersonCard
                    key={index}
                    profile={person}
                    picture={person.picture}
                    url={person.url}
                    name={person.name}
                />
            )}
        />
    </App>
)

Page.getInitialProps = wrapInitialProps(async (ctx) => {
    const pageUrl = ctx.req.url

    const res = await requestGet<IResponseItems<IPerson>>(createApiUrl(ctx.req, '/api/persons'), { items: [] })
    const persons = res.items || []
    const title = 'Преподаватели Шлиссельбургской ДХШ'
    const imageFile = 'Images/HudozkaCollective2017.jpg'
    const resImage = await requestGet(createApiUrl(ctx.req, `/api/image?file=${imageFile}`), null)
    const image = get(resImage, 'artifacts.large', null)

    return {
        persons,
        image,
        pageUrl,
        title,
        meta: meta({
            title,
            url: pageUrl,
            description: 'Преподаватели Шлиссельбургской ДХШ',
        })
    }
})

export default Page
