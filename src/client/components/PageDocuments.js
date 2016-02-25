import template from '../../templates/components/page-documents.html';
import {docs} from '../../models/document';

export default function (app) {
    app.component('pageDocuments', {
        template: template,
        controller: function (api) {
            this.pageClass = 'page-documents';

            this.documents = docs;

            api.document.awards()
                .success(data => {
                    this.awards = data;
                });
        }
    });
};