import co from 'co';
import route from 'koa-route';
import {index, json} from './';
import {c} from '../core/db';

export default function (app) {
    [
        [
            '/documents',
            json(function *() {
                let query = {};
                this.body = yield c('documents')
                    .find(query)
                    .toArray();
            })
        ],
        [
            '/documents/type/:type',
            function *(type) {
                let types = {
                    'document': ['documents', {type: 'document'}, populateDocPreview],
                    'award': ['awards', {}, populateDocPreview]
                };

                if (type in types) {
                    let [collection, query, mapFn] = types[type];

                    let docs = yield c(collection)
                        .find(query)
                        .toArray();

                    if (mapFn) docs = yield docs.map(mapFn);

                    this.body = docs;
                } else {
                    this.status = 404;
                }
            }
        ]
    ].forEach(item => {
        let [path, fn] = item;
        app.use(route.get(path, fn));
    });
};

function* populateDocPreview(doc) {
    doc.preview = yield c('images').findOne({_id: doc.preview});
    return doc;
}
