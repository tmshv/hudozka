const React = require('react')
const Article = require('../components/Article')
const DocumentList = require('../components/DocumentList')
const Document = require('../core/Document')
const ImageArtifactType = require('../core/ImageArtifactType')
const {render} = require('../lib/render')
const {prioritySort} = require('../lib/sort')
const getPathWithNoTrailingSlash = require('../lib/url').getPathWithNoTrailingSlash
const {get} = require('koa-route')
const {splitBy} = require('../lib/array')
const {unique} = require('../utils/common')

const sizes = [
	ImageArtifactType.MEDIUM,
	ImageArtifactType.BIG,
	ImageArtifactType.ORIGIN,
]

function getDocumentsMeta() {
	return {
		title: 'Документы',
		description: 'Документы Шлиссельбургской ДХШ',
	}
}

function getMeta(teacher) {
	return {
		title: teacher.name,
		description: teacher.name,
	}
}

async function bakeDocument(document) {
	//const preview = await document.preview.unpack()
	const preview = document.preview
	if (!preview) return null

	const image = preview.findArtifact(sizes)
	if (!image) return null

	return {
		category: document.category,
		title: document.title,
		fileName: document.file.name,
		fileSize: document.file.size,
		fileUrl: document.url,
		imageUrl: image.url,
		url: document.viewUrl,
	}
}

function getDocuments() {
	return get('/documents', async (ctx) => {
		const path = getPathWithNoTrailingSlash(ctx.path)
		let documents = await Document.find({})

		if (documents) {
			//documents = teachersSorted(documents)
			documents = await Promise.all(documents.map(bakeDocument))
			documents = documents.filter(Boolean)

			//const collections = splitBy(d => d.category)(documents)
			const collections = getSorted(documents)

			const Component = (
				<div className="content content_thin">
					{collections.map(({name, items}, index) => (
						<DocumentList key={index} name={name} documents={items}/>
					))}
				</div>
			)

			ctx.type = 'text/html'
			ctx.body = await render(path, Component, getDocumentsMeta(), {menuPadding: true})
		} else {
			ctx.status = 404
		}
	})
}

function getSorted(documents) {
	const compose = (...fns) => value => fns
		.map(fn => fn)
		.reverse()
		.reduce((acc, fn) => fn(acc), value)

	const pass = fn => value => {
		fn(value)
		return value
	}

	const subtract = (a, b) => a - b

	const uniqueCategories = unique(i => i.category)

	const priority = {
		'Основные документы': [
			'https://static.shlisselburg.org/art/uploads/ustav-2015.pdf',
			'https://static.shlisselburg.org/art/uploads/obrazovatelnaia-litsenziia-2015.pdf',
			'https://static.shlisselburg.org/art/uploads/svidetelstvo-na-pomeshchenie.pdf',
			'https://static.shlisselburg.org/art/uploads/egriul.pdf',
			'https://static.shlisselburg.org/art/uploads/inn.pdf',
			'https://static.shlisselburg.org/art/uploads/reshenie-o-sozdanii-shkoly.pdf',
			'https://static.shlisselburg.org/art/uploads/kopiia-resheniia-o-naznachenii-rukovoditelia.pdf',
			'https://static.shlisselburg.org/art/uploads/postanovlenie-o-sozdanii-munitsipalnogo-obrazovatelnogo-uchrezhdeniia-kultury-detskaia-khudozhestvennaia-shkola.pdf',
		],
		'Учебные программы': [
			'https://static.shlisselburg.org/art/uploads/uchebnaia-programma-zhivopis.pdf',
		]
	}

	const CATEGORY_PRIORITY = [
		'Основные документы',
		'Планы ФХД',
		'Самообследование деятельности',
		'Инструкции',
		'Образование',
		'Учебные программы',
		'Платные образовательные услуги',
		'Дополнительные общеразвивающие программы',
		'Документы для поступления',
	]

	const sortBy = fn => (a, b) => [a, b]
		.map(fn)
		.reduce(subtract)

	const getPriorityFn = (m, list) => value => list.includes(value)
		? list.indexOf(value)
		: m

	const safeSelect = (d, store, key) => key in store
		? store[key]
		: d

	const categoryPriority = getPriorityFn(10000, CATEGORY_PRIORITY)

	const documentPriority = ({category, fileUrl}) => compose(
		getPriorityFn.bind(null, 10000),
		safeSelect.bind(null, [], priority)
	)(category)(fileUrl)

	const documentsOf = category => documents.filter(i => i.category === category)
	const sorted = documents => documents.sort(sortBy(documentPriority))
	const collectDocumentsByCategory = compose(sorted, documentsOf)

	return uniqueCategories(documents)
		.sort(sortBy(categoryPriority))
		.reduce((acc, name) => [...acc, {
			name,
			items: collectDocumentsByCategory(name)
		}], [])
}

exports.getDocuments = getDocuments
