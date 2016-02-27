import template from '../../templates/components/page-documents.html';

let unique = fn => list => [...new Set(list.map(fn))];

export default function (app) {
    app.component('pageDocuments', {
        template: template,
        controller: function (api) {
            this.pageClass = 'page-documents';
            let categories = unique(i => i.category);

            this.collections = [];

            api.document.documents()
                .success(documents => {
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
                });

            api.document.awards()
                .success(data => {
                    this.awards = data;
                });
        }
    });
};