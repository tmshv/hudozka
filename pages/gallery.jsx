import React from 'react'
import axios from 'axios'
import App from '../src/components/App'
// import Album from '../src/components/Album'
import Article from '../src/components/Article'
import menuModel from '../src/models/menu'
import { buildMenu } from '../src/lib/menu'
import { splitBy } from '../src/lib/array'

const albumsByYear = splitBy(album => new Date(album.date).getFullYear())

function getMeta() {
    return {
        title: 'Галерея',
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
    const apiUrl = `http://localhost:3000/api/albums`
    const res = await axios.get(apiUrl)
    const items = res.data.items
    const albumCollections = albumsByYear(items)

    return {
        collections: [...albumCollections.entries()],
        pageUrl,
    }
}

export default Page