import route from 'koa-route';
import {index, json, accepts} from './';
import {c} from '../core/db';

function* exists(id) {
    let i = yield c('documents').findOne({id: id});
    return i ? true : false;
}

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
                    'award': ['documents', {type: 'award'}, populateDocPreview]
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
        ],
        [
            '/documents/:id',
            accepts({
                'text/html': index(exists),
                'text/plain': index(exists),
                'application/json': function* (id) {
                    let i = yield c('documents').findOne({id: id});
                    if (!i) this.status = 404;
                    else {
                        i = yield populateDocPreview(i);
                        this.body = i;
                    }
                }
            })
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
