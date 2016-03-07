import template from '../../templates/components/page-events.html';

export default function (app) {
    app.component('pageEvents', {
        bindings: {
            posts: '<',
            page: '@',
            totalPages: '@'
        },
        template: template,
        controllerAs: '$',
        controller: function (api, menu) {
            menu.activate('/events');

            this.page = parseInt(this.page);
            this.totalPages = parseInt(this.totalPages);

            this.prevPage = this.page === 1 ? null : this.page - 1;
            this.nextPage = this.page === this.totalPages ? null : this.page + 1;
        }
    });
};
