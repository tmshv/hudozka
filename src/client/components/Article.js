import template from '../../templates/components/article.html';

export default function (app) {
    app.component('hArticle', {
        bindings: {
            post: '<'
        },
        template: template,
        controllerAs: '$',
        controller: function ($sce) {
            this.message = $sce.trustAsHtml(this.post.post);
            this.url = `/article/${this.post.id}`;
        }
    });
};