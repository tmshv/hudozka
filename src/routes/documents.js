import co from 'co';
import route from 'koa-route';
import {index, json} from './';
import db from '../core/db';

export default function (app) {
    [
        [
            '/documents',
            json(function *() {
                let query = {};
                this.body = yield db.c('documents')
                    .find(query)
                    .toArray();
            })
        ],
        [
            '/documents/:type',
            json(function *(type) {
                this.body = yield db.c(type)
                    .find()
                    .toArray();
            })
        ],
        [
            '/document/:doc',
            index('../templates/document.html')
        ]
    ].forEach(item => {
        let [path, fn] = item;
        app.use(route.get(path, fn));
    });
};
