import template from '../../templates/components/article-page-control.html';

export default function (app) {
    app.component('articlePageControl', {
        bindings: {
            direction: '@',
            page: '@'
        },
        template: template,
        controllerAs: '$',
        controller: function () {
            let i = this.direction === 'direct' ? 1 : 0;
            this.text = ['↑ Предыдущая страница', '↓ Следующая страница'][i];
            this.style = ['article-page-control__top', 'article-page-control__bottom'][i];
        }
    });
};