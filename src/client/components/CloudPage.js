import template from '../../templates/components/cloud-page.html';

export default function (app) {
	app.component('cloudPage', {
		bindings: {
			page: '<data'
		},
		template: template,
		controllerAs: '$',
		controller: function ($rootScope, $sce) {
			if (this.page) $rootScope.title = this.page.title;
			this.content = $sce.trustAsHtml(this.page.data);
		}
	});
};
