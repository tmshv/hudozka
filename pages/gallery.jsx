import React from 'react'
import Head from 'next/head'
import { App } from '../src/components/App'
// import Album from '../src/components/Album'
import Article from '../src/components/Article'
import { Meta } from '../src/components/Meta'
import menuModel from '../src/models/menu'
import { buildMenu } from '../src/lib/menu'
import { splitBy } from '../src/lib/array'
import { meta } from '../src/lib/meta'
import { createApiUrl, requestGet } from '../src/next-lib'

const albumsByYear = splitBy(album => new Date(album.date).getFullYear())

function getMeta() {
    return {
        description: 'Галерея работ учащихся Шлиссельбургской Детской Художественной Школы'
    }
}

const m = 1
const AlbumImage = ({ data, alt }) => (
    <picture>
        <img
            className="opa"
            alt={alt}
            src={data.src}
            width={data.width * m}
            height={data.height * m}
            srcSet={(data.set || []).map(({ url, density }) => `${url} ${density}x`)}
        />
    </picture>
)

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


const Page = (props) => (
    <App
        menu={buildMenu(props.pageUrl, menuModel)}
        showAuthor={true}
        menuPadding={true}
    >
        <Head>
            <title>{props.title}</title>
            <Meta meta={props.meta} />
        </Head>

        <div className="content content_semi-wide">
            <Article
                // title={meta.title}
                title={'Галерея'}
            >
                {props.collections.map(([year, albums], index) => (
                    <ACollection
                        key={index}
                        title={year}
                        albums={albums}
                    />
                ))
                }
            </Article>
        </div>
    </App>
)

Page.getInitialProps = async (ctx) => {
    const pageUrl = ctx.req.url
    const res = await requestGet(createApiUrl(ctx.req, `/api/albums`), {})
    const items = res.items || []
    const albumCollections = albumsByYear(items)
    const title = 'Галерея'

    return {
        collections: [...albumCollections.entries()],
        pageUrl,
        title,
        meta: meta({
            title,
            description: 'Галерея работ учащихся Шлиссельбургской Детской Художественной Школы'
        })
    }
}

export default Page