import template from '../../templates/components/footer-links.html';

export default function (app) {
    app.component('footerLinks', {
        bindings: {
            title: '@',
            links: '<'
        },
        template: template
    });
};