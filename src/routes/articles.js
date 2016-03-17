import route from 'koa-route';
import {c} from '../core/db';
import {accepts, index} from './';
import {sortBy} from '../utils/sort';

export default function (app) {

    function* exists(id) {
        let i = yield c('events').findOne({id: id});
        if (!i) {
            i = yield c('timeline').findOne({id: id});
        }
        return i ? true : false;
    }

    app.use(route.get('/article/:id', accepts({
        //'text/html': function* (id){
        //    let test = yield exists(id);
        //    if(test){
        //        return yield index();
        //    }else{
        //        this.status = 404;
        //        return yield index();
        //    }
        //},
        'text/html': index(exists),
        'text/plain': index(exists),
        'application/json': function* (id) {
            let i = yield c('events').findOne({id: id});
            if (!i) {
                i = yield c('timeline').findOne({id: id});
            }

            if (!i) this.status = 404;
            else  this.body = i;
        }
    })));
};
