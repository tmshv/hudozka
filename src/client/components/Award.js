import template from '../../templates/components/award.html';

export default function (app) {
    app.component('award', {
        bindings: {
            document: '<'
        },
        template: template,
        controllerAs: '$'
    });
};