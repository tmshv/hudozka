/**
 * Created by tmshv on 22/11/14.
 */

import co from 'co';
import route from 'koa-route';
import router from './';
import db from '../core/db';

export default function (app) {
    [
        [
            '/documents',
            router.accepts({
                'text/html': router.index(),
                'text/plain': router.index(),
                'application/json': function *() {
                    let query = {};
                    this.body = yield db.c('documents')
                        .find(query)
                        .toArray();
                }
            })
        ],
        [
            '/documents/:type',
            router.accepts({
                'text/html': router.index(),
                'text/plain': router.index(),
                'application/json': function *(type) {
                    this.body = yield db.c(type)
                        .find()
                        .toArray();
                }
            })
        ]

    ].forEach(item => {
        //let {path, fn} = item;
        let [path, fn] = item;
        app.use(route.get(path, fn));
    });
};
