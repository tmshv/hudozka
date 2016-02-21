import template from '../../templates/components/breadcrumbs.html';

export default function (app) {
    app.component('breadcrumbs', {
        bindings: {
            crumbs: '='
        },
        template: template
    });
};