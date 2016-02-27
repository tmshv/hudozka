import template from '../../templates/components/page-documents.html';

export default function (app) {
    app.component('pageDocuments', {
        template: template,
        controller: function (api) {
            this.pageClass = 'page-documents';

            api.document.documents()
                .success(data => {
                    this.documents = data;
                });

            api.document.awards()
                .success(data => {
                    this.awards = data;
                });
        }
    });
};