import Head from 'next/head'
import { get } from 'lodash'
import { App } from 'src/components/App'
import { Meta } from 'src/components/Meta'
import { CollectiveImage } from 'src/components/CollectiveImage'
import { meta } from 'src/lib/meta'
import { IMeta, Person } from 'src/types'
import { createApiUrl, requestGet, IResponseItems } from 'src/next-lib'
import { NextPage, NextPageContext } from 'next'
import { CardGrid } from 'src/components/CardGrid'
import { Card } from 'src/components/Card'
import { Block } from 'src/components/Block'

type CardData = {
    title: string
    caption?: string
    imageSrc: string
    imageAlt: string
    imageSrcSet: string
    href: string
}

type Props = {
    title: string
    image: string
    meta: IMeta
    data: CardData[]
}

const Page: NextPage<Props> = props => {
    if (!props.data) {
        console.log('kek error')
        return
    }

    return (
        <App
            showAuthor={true}
            wide={true}
        >
            <Head>
                <title>{props.title}</title>
                <Meta meta={props.meta} />
            </Head>

            {!props.image ? null : (
                <CollectiveImage
                    data={props.image}
                    style={{
                        marginBottom: 'var(--size-l)',
                    }}
                />
            )}

            <CardGrid style={{
                marginBottom: 'var(--size-xl)',
            }}>
                {props.data.map(item => (
                    <Card
                        key={item.href}
                        layout={'featured'}
                        img={{
                            src: item.imageSrc,
                            alt: item.imageAlt,
                            srcSet: item.imageSrcSet,
                        }}
                        href={item.href}
                    >
                        <Block direction={'vertical'}>
                            <span>{item.title}</span>
                            <span style={{
                                paddingTop: 'var(--size-s)',
                                fontSize: 'var(--font-size-second)',
                            }}>
                                {item.caption}
                            </span>
                        </Block>
                    </Card>
                ))}
            </CardGrid>
        </App>
    )
}

export const unstable_getStaticProps = async (ctx: NextPageContext) => {
    const res = await requestGet<IResponseItems<Person>>(createApiUrl('/api/persons'), null)
    const title = 'Преподаватели Шлиссельбургской ДХШ'
    const imageFile = 'Images/HudozkaCollective2017.jpg'
    const resImage = await requestGet(createApiUrl(`/api/image?file=${imageFile}`), null)
    const image = get(resImage, 'artifacts.large', null)
    const data: CardData[] = (res?.items || [])
        .map(x => {
            const title = `${x.name[0]} ${x.name[1]} ${x.name[2]}`
            return {
                title,
                caption: x.position,
                href: x.url,
                imageSrc: x.picture.src,
                imageAlt: title,
                imageSrcSet: '',
            }
        })


    return {
        props: {
            data,
            image,
            title,
            meta: meta({
                title,
                description: 'Преподаватели Шлиссельбургской ДХШ',
            })
        }
    }
}

export default Page
