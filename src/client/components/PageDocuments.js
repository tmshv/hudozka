import template from '../../templates/components/page-documents.html'
import {unique} from '../../utils/common'

const compose = (...fns) => value => fns
	.map(fn => fn)
	.reverse()
	.reduce((acc, fn) => fn(acc), value)

const pass = fn => value => {
	fn(value)
	return value
}

const subtract = (acc, i) => acc - i

const uniqueCategories = unique(i => i.category)

const priority = {
	'Основные документы': [
		'https://static.shlisselburg.org/art/uploads/ustav-2015.pdf',
		'https://static.shlisselburg.org/art/uploads/obrazovatelnaia-litsenziia-2015.pdf',
		'https://static.shlisselburg.org/art/uploads/svidetelstvo-na-pomeshchenie.pdf',
		'https://static.shlisselburg.org/art/uploads/reshenie-o-sozdanii-shkoly.pdf',
		'https://static.shlisselburg.org/art/uploads/postanovlenie-o-sozdanii-munitsipalnogo-obrazovatelnogo-uchrezhdeniia-kultury-detskaia-khudozhestvennaia-shkola.jpg.pdf',
		'https://static.shlisselburg.org/art/uploads/kopiia-resheniia-o-naznachenii-rukovoditelia.pdf',
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

const getPriorityFn = list => value => list.includes(value)
	? list.indexOf(value)
	: 10000

const safeSelect = (d, store, key) => key in store
	? store[key]
	: d

const documentPriority = ({category, url}) => compose(
	getPriorityFn,
	safeSelect.bind(null, [], priority)
)(category)(url)

//const documentPriority = ({category, url}) => {
//	const list = safeSelect([], priority, category)
//	return getPriorityFn(list)(url)
//}

const categoryPriority = getPriorityFn(CATEGORY_PRIORITY)

const sortBy = fn => (a, b) => [a, b]
	.map(fn)
	.reduce(subtract)

export default function (app) {
	app.component('pageDocuments', {
		bindings: {
			documents: '<'
		},
		template: template,
		controllerAs: '$',
		controller: function () {
			const documents = this.documents

			const documentsOf = category => documents.filter(i => i.category === category)
			const sorted = documents => documents.sort(sortBy(documentPriority))
			const collectDocumentsByCategory = compose(sorted, documentsOf)

			this.collections = uniqueCategories(documents)
				.sort(sortBy(categoryPriority))
				.reduce((acc, name) => (
					[...acc, {
						name,
						documents: collectDocumentsByCategory(name)
					}]
				), [])
		}
	})
}
