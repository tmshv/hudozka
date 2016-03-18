import template from '../../templates/components/document.html';

export default function (app) {
    app.component('document', {
        bindings: {
            document: '<',
            preview: '@'
        },
        controllerAs: '$',
        controller: function () {
            const size = this.preview || 'medium';
            this.imageClass = `document__image--${size}`;
            
            this.previewUrl = this.document.preview.data[size].url;
            this.file = this.document.file;
        },
        template: template
    });
};