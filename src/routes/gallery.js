const React = require('react')
const Article = require('../components/Article')
const Album = require('../core/Album')
const {render} = require('../lib/render')
const {splitBy} = require('../lib/array')
const getPathWithNoTrailingSlash = require('../lib/url').getPathWithNoTrailingSlash
const {get} = require('koa-route')

function getMeta() {
	return {
		title: 'Галерея',
		description: 'Галерея работ учащихся Шлиссельбургской Детской Художественной Школы'
	}
}

// {data.set.map((s, i) => (
// 	<source
// 		key={i}
// 		src={i}
// 	/>
// ))}
// const m = 0.5
const m = 1
const AlbumImage = ({data, alt}) => (
	<picture>
		<img
			alt={alt}
			src={data.src}
			width={data.width * m}
			height={data.height * m}
			srcSet={data.set.map(({url, density}) => `${url} ${density}x`)}
		/>
	</picture>
)

const GItem = ({album}) => (
	<div className="gallery-item">
		<a className="invisible" href={album.url}>
			<AlbumImage data={album.preview} alt={album.title}/>
		</a>
	</div>
)

const ACollection = ({title, albums}) => (
	<div className="album-collection">
		<div className="album-collection__title">{title}</div>
		<div className="album-collection__body">{
			albums.map((album, index) => (
				<GItem key={index} album={album}/>
			))
		}</div>
	</div>
)

function getGallery() {
	return get('/gallery', async ctx => {
		const path = getPathWithNoTrailingSlash(ctx.path)
		const query = {}
		const albums = await Album.find(query, {sort: {date: -1}})

		if (albums.length) {
			const meta = getMeta()
			const albumsByYear = splitBy(a => a.date.getFullYear())(albums)

			const Component = (
				<div className="content content_wide">
					<Article title={meta.title}>
						{
							[...albumsByYear.entries()].map(([year, albums], index) => (
								<ACollection
									key={index}
									title={year}
									albums={albums}
								/>
							))
						}
					</Article>
				</div>
			)

			ctx.type = 'text/html'
			ctx.body = await render(path, Component, getMeta())
		} else {
			ctx.status = 404
		}
	})
}

exports.getGallery = getGallery
