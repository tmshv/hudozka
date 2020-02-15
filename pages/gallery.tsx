import Head from 'next/head'
import { App } from 'src/components/App'
import { Meta } from 'src/components/Meta'
import menuModel from 'src/models/menu'
import { buildMenu } from 'src/lib/menu'
import { splitBy } from 'src/lib/array'
import { meta } from 'src/lib/meta'
import { createApiUrl, requestGet } from 'src/next-lib'
import { NextPage } from 'next'
import { PageHeader } from 'src/components/PageHeader'

const albumsByYear = splitBy(album => new Date(album.date).getFullYear())

function getMeta() {
    return {
        description: 'Галерея работ учащихся Шлиссельбургской Детской Художественной Школы'
    }
}

function resize(maxWidth, width, height) {
    const ratio = maxWidth / width

    return [
        width * ratio,
        height * ratio,
    ]
}

const m = 1
const AlbumImage = ({ data, alt }) => {
    const [width, height] = resize(200, data.width, data.height)
    return (
        <picture>
            <img
                className="opa"
                alt={alt}
                src={data.src}
                width={width * m}
                height={height * m}
                srcSet={(data.set || []).map(({ url, density }) => `${url} ${density}x`)}
            />
        </picture>
    )
}

const GItem = ({ album }) => (
    <div className="gallery-item">
        <a className="invisible" href={album.url}>
            <AlbumImage data={album.preview} alt={album.title} />
        </a>
    </div>
)

const ACollection = ({ title, albums }) => (
    <div className="album-collection">
        <div className="album-collection__title">{title}</div>
        <div className="album-collection__body">{
            albums.map((album, index) => (
                <GItem key={index} album={album} />
            ))
        }</div>
    </div>
)

interface IProps {
    meta: any
    pageUrl: string
    title: string
    collections: any[]
}

const Page: NextPage<IProps> = props => (
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

        <PageHeader
            title={props.title}
        />

        {props.collections.map(([year, albums], index) => (
            <ACollection
                key={index}
                title={year}
                albums={albums}
            />
        ))}
    </App>
)

export const unstable_getStaticProps = async (ctx: any) => {
    // const pageUrl = ctx.req.url
    const pageUrl = '/gallery'
    const res = await requestGet<any>(createApiUrl(`/api/albums`), null)
    if (!res) {
        return null
    }
    const items = res.items || []
    const albumCollections = albumsByYear(items)
    const title = 'Галерея'

    return {
        props: {
            collections: [...albumCollections.entries()],
            pageUrl,
            title,
            meta: meta({
                title,
                description: 'Галерея работ учащихся Шлиссельбургской Детской Художественной Школы'
            })
        }
    }
}

export default Page
