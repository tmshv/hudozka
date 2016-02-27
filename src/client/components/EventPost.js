import template from '../../templates/components/event-post.html';

export default function (app) {
    app.component('eventPost', {
        bindings: {
            post: '<'
        },
        template: template,
        controllerAs: '$',
        controller: function ($sce) {
            this.message = $sce.trustAsHtml(this.post.post);
            this.url = `/event/${this.post.id}`;
        }
    });
};