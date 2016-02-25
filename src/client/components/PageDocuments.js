import template from '../../templates/components/page-documents.html';

export default function (app) {
    app.component('pageDocuments', {
        template: template,
        controller: function(api, docs) {
            this.pageClass = 'page-documents';

            this.documents = docs.docs;

            api.document.awards()
                .success(data => {
                    this.awards = data;
                });
        }
    });
};