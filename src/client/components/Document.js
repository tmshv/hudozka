import template from '../../templates/components/document.html';

export default function (app) {
    app.component('document', {
        bindings: {
            document: '<'
        },
        controllerAs: '$',
        controller: function () {
            this.previewUrl = this.document.preview.data.medium.url;
            this.file = this.document.file;
        },
        template: template
    });
};