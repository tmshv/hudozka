const React = require('react')
const getArticleListComponent = require('../routes/articles').getArticleListComponent
const {render} = require('../lib/render')

function getMeta(article) {
	return {
		title: article.title,
	}
}

	const articles = await getArticleListComponent(path, 1, pageSize)
async function renderHome(path, pageSize) {

	const Component = (
		<div className="content content_wide">
			<div className="hudozka-title">
				<p>МБУДО</p>
				<h1>Шлиссельбургская детская художественная&nbsp;школа</h1>
			</div>

			{articles}
		</div>
	)

	return render(path, Component, getMeta({title: 'Шлиссельбургская ДХШ'}), {showAuthor: true})
}

exports.renderHome = renderHome
