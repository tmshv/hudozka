import template from '../../templates/components/page-event.html';

export default function (app) {
    app.component('pageEvent', {
        template: template,
        controllerAs: '$',
        controller: function ($rootScope, $routeParams, api, menu) {
            this.pageClass = 'page-event';
            menu.activate('/events');

            let id = $routeParams.event;
            if(!id) return;

            api.event.post(id)
                .success(post => {
                    $rootScope.title = post.title;
                    this.posts = [post];
                });
        }
    });
};