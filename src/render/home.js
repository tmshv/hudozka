const React = require('react')
const HudozkaTitle = require('../components/HudozkaTitle')
const {createArticleCardList} = require('../render/articles')
const {render} = require('../lib/render')

function getMeta(article) {
	return {
		title: article.title,
	}
}

async function renderHome(path, pageSize) {
	const articles = await createArticleCardList(1, pageSize)

	const Component = (
		<div className="content content_wide">
			<HudozkaTitle/>

			{articles}
		</div>
	)

	return render(path, Component, getMeta({title: 'Шлиссельбургская ДХШ'}), {showAuthor: true})
}

exports.renderHome = renderHome
