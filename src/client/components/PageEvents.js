import template from '../../templates/components/page-events.html';

export default function (app) {
    app.component('pageEvents', {
        bindings: {
            events: '<'
        },
        template: template,
        controllerAs: '$',
        controller: function (api, menu) {
            this.pageClass = 'page-events';
            menu.activate('/events');

            //api.event.list()
            //    .success(posts => {
            //        this.posts = posts;
            //    });
        }
    });
};