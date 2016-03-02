import template from '../../templates/components/page-documents.html';
import {unique} from '../../utils/common';

export default function (app) {
    app.component('pageDocuments', {
        bindings: {
            awards: '<',
            documents: '<'
        },
        template: template,
        controllerAs: '$',
        controller: function () {
            this.pageClass = 'page-documents';
            let categories = unique(i => i.category);

            this.collections = [];

            let documents = this.documents;
            let cats = categories(documents)
                .map(cat => new Object({
                    name: cat,
                    documents: []
                }));

            let docCollections = documents.reduce(
                (cats, doc) => {
                    let c = cats.find(i => i.name === doc.category);
                    c.documents.push(doc);
                    return cats;
                },
                cats
            );

            this.collections = this.collections.concat(docCollections);
        }
    });
};