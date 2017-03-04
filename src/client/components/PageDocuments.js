import template from '../../templates/components/page-documents.html'
import {unique} from '../../utils/common'

export default function (app) {
	app.component('pageDocuments', {
		bindings: {
			documents: '<'
		},
		template: template,
		controllerAs: '$',
		controller: function () {
			const documents = this.documents
			const uniqueCategories = unique(i => i.category)
			const documentsOf = category => documents.filter(i => i.category === category)

			this.collections = uniqueCategories(documents)
				.reduce((acc, category) => (
					[...acc, {
						name: category,
						documents: documentsOf(category)
					}]
				), [])
		}
	})
};
