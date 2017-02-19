import template from '../../templates/components/page-awards.html'

export default function (app) {
	app.component('pageAwards', {
		bindings: {
			items: '<',
		},
		template: template,
		controllerAs: '$',
	})
}
