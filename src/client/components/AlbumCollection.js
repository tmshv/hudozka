import template from '../../templates/components/album-collection.html';

export default function (app) {
    app.component('albumCollection', {
        bindings: {
            title: '@',
            albums: '<'
        },
        template: template
    });
};