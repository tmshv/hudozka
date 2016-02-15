import template from '../../templates/components/document.html';

export default function (app) {
    app.component('document', {
        bindings: {
            document: '='
        },
        controller: function () {
            //this.testing = 123;
        },
        template: template
    });
};