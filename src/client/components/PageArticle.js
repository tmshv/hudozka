import template from '../../templates/components/page-article.html';

export default function (app) {
    app.component('pageArticle', {
        bindings: {
            article: '<'
        },
        template: template,
        controllerAs: '$',
        controller: function ($rootScope, $routeParams, api, menu) {
            menu.activate('/events');

            if(this.article){
                $rootScope.title = this.article.title;
            }

            //this.posts = [this.article];

            //let id = $routeParams.id;
            //if(!id) return;
            //
            //api.article.id(id)
            //    .then(i => i.data)
            //    .then(post => {
            //        $rootScope.title = post.title;
            //        this.posts = [post];
            //    });
        }
    });
};
