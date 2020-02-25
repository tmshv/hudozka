import Head from 'next/head'
import { App } from 'src/components/App'
import { Meta } from 'src/components/Meta'
import { CollectiveImage } from 'src/components/CollectiveImage'
import { meta } from 'src/lib/meta'
import { IMeta, IPage, ImageDefinition } from 'src/types'
import { createApiUrl, requestGet } from 'src/next-lib'
import { NextPage, NextPageContext } from 'next'
import { CardGrid } from 'src/components/CardGrid'
import { Card } from 'src/components/Card'
import { Block } from 'src/components/Block'

const persons = [
    '/teacher/mg-timasheva',
    '/teacher/va-sarzhin',
    '/teacher/od-gogoleva',
    '/teacher/nv-andreeva',
    '/teacher/vv-voronova',
    '/teacher/ea-burovtseva',
    '/teacher/sa-latipova',
    '/teacher/iv-khramov',
    '/teacher/ma-khramova',
    // АС Тимашева
    // ЕЮ Тарасова
    // ИН Втюрина
    // МЮ Валькова
    // РК Тимашев
]

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
    const title = 'Преподаватели Шлиссельбургской ДХШ'
    const imageFile = 'Images/HudozkaCollective2017.jpg'
    const resImage = await requestGet<ImageDefinition>(createApiUrl(`/api/image?file=${imageFile}`), null)
    const image = resImage?.artifacts.large

    const pages = await Promise.all(persons
        .map(page => requestGet<IPage>(createApiUrl(`/api/page?page=${page}`), null))
    )
    const data: CardData[] = pages
        .filter(Boolean)
        .map(x => {
            const image = x.preview.artifacts.large

            return {
                title: x.title,
                caption: x.description,
                href: x.url,
                imageSrc: image.src,
                imageAlt: title,
                imageSrcSet: image.set.join(' ')
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
