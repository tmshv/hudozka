import template from '../../templates/components/navigation.html';

export default function (app) {
    app.component('navigation', {
        bindings: {
            menu: '<'
        },
        template: template
    });
};