import Head from 'next/head'
import { get } from 'lodash'
import { App } from 'src/components/App'
import { Meta } from 'src/components/Meta'
import { CollectiveImage } from 'src/components/CollectiveImage'
import { PersonCard } from 'src/components/PersonCard'
import menuModel from 'src/models/menu'
import { buildMenu } from 'src/lib/menu'
import { meta } from 'src/lib/meta'
import { IMeta, IImage } from 'src/types'
import { createApiUrl, requestGet, IResponseItems } from 'src/next-lib'
import { NextPage, NextPageContext } from 'next'
import { CardGrid } from 'src/components/CardGrid'

interface IPerson {
    url: string
    name: string
    picture: IImage
}

type Props = {
    pageUrl: string
    title: string
    image: string
    meta: IMeta
    data: IPerson[]
}

const Page: NextPage<Props> = props => {
    if (!props.data) {
        console.log('kek error')
        return
    }

    return (
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

            <CardGrid style={{
                marginBottom: 'var(--size-xl)',
            }}>
                {props.data.map((item, index) => (
                    <PersonCard
                        key={index}
                        profile={item}
                        picture={item.picture}
                        url={item.url}
                        name={item.name}
                    />
                ))}
            </CardGrid>
        </App>
    )
}

export const unstable_getStaticProps = async (ctx: NextPageContext) => {
    // const pageUrl = ctx.req.url
    const pageUrl = '/collective'

    const res = await requestGet<IResponseItems<IPerson>>(createApiUrl('/api/persons'), null)
    const data = res?.items || []
    const title = 'Преподаватели Шлиссельбургской ДХШ'
    const imageFile = 'Images/HudozkaCollective2017.jpg'
    const resImage = await requestGet(createApiUrl(`/api/image?file=${imageFile}`), null)
    const image = get(resImage, 'artifacts.large', null)

    return {
        props: {
            data,
            image,
            pageUrl,
            title,
            meta: meta({
                title,
                url: pageUrl,
                description: 'Преподаватели Шлиссельбургской ДХШ',
            })
        }
    }
}

export default Page
