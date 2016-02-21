import template from '../../templates/components/gallery-item.html';

export default function (app) {
    app.component('galleryItem', {
        bindings: {
            record: '='
        },
        template: template
    });
};