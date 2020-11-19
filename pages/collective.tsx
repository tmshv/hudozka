import Head from 'next/head'
import { App } from 'src/components/App'
import { Meta } from 'src/components/Meta'
import { meta } from 'src/lib/meta'
import { IMeta, IPage, ImageSize } from 'src/types'
import { createApiUrl, requestGet } from 'src/next-lib'
import { NextPage, NextPageContext } from 'next'
import { CardGrid } from 'src/components/CardGrid'
import { Card } from 'src/components/Card'
import { Block } from 'src/components/Block'
import { Image } from 'src/components/Image'
import { imageSrcSet } from 'src/lib/image'

const persons = [
    '/teacher/mg-timasheva',
    '/teacher/va-sarzhin',
    '/teacher/od-gogoleva',
    '/teacher/nv-andreeva',
    '/teacher/vv-voronova',
    '/teacher/ea-burovtseva',
    '/teacher/sa-latipova',
    //'/teacher/iv-khramov',
    //'/teacher/ma-khramova',
    '/teacher/av-belyaeva',
    '/teacher/aa-khopryaninova',
    '/teacher/ay-orlova',
    '/teacher/ms-strukova',
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
    meta: IMeta
    data: CardData[]
}

const Index: NextPage<Props> = props => {
    if (!props.data) {
        console.log('collective kek error')
        return
    }

    const src = 'https://art.shlisselburg.org/static/img/collective2019.jpg'
    const srcSet = imageSrcSet(src, [ImageSize.big, ImageSize.large, ImageSize.medium, ImageSize.small])

    return (
        <App
            showAuthor={true}
            wide={true}
        >
            <Head>
                <title>{props.title}</title>
                <Meta meta={props.meta} />
            </Head>

            <Image
                src={src}
                srcSet={srcSet}
                style={{
                    marginBottom: 'var(--size-l)',
                    borderRadius: 'var(--radius)',
                }}
            />

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

export const getStaticProps = async (ctx: NextPageContext) => {
    const title = 'Преподаватели Шлиссельбургской ДХШ'
    const pages = await Promise.all(persons
        .map(page => requestGet<IPage>(createApiUrl(`/api/page?page=${page}`), null))
    )
    const data: CardData[] = pages
        .filter(Boolean)
        .map(x => {
            return {
                title: x.title,
                caption: x.description,
                href: x.url,
                imageAlt: title,
                imageSrc: x.cover.src,
                imageSrcSet: imageSrcSet(x.cover.src, [ImageSize.medium, ImageSize.small])
            }
        })

    return {
        props: {
            data,
            title,
            meta: meta({
                title,
                description: 'Преподаватели Шлиссельбургской ДХШ',
            })
        }
    }
}

export default Index
