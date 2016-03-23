import co from 'co';
import compose from 'koa-compose';
import route from 'koa-route';
import {c} from '../core/db';
import {json} from './';

export default function () {
    return compose([
        gallery(),
        album()
    ]);

    //app.use(route.get('/gallery/:year', json(
    //    function *(year) {
    //        year = parseInt(year);
    //        let start = new Date(year, 0, 1);
    //        let end = new Date(year, 11, 31);
    //        let query = {
    //            date: {$gte: start, $lt: end}
    //        };
    //        let albums = yield c('albums')
    //            .find(query)
    //            .toArray();
    //
    //        albums = yield albums.map(processAlbum);
    //        this.body = albums;
    //    }
    //)));
};

function gallery(){
    return route.get('/gallery', json(
        async(ctx) => {
            let query = {};
            let fields = ['_id', 'id', 'title', 'date'];
            //.reduce((f, i) => {
            //    f[i] = 1;
            //    return f;
            //}, {});

            let albums = await c('albums')
                .find(query)
                .toArray();

            //albums = albums.map(i => {
            //    return fields.reduce((a, key)=> {
            //        a[key] = i[key];
            //        return a;
            //    }, {});
            //});

            albums = await Promise.all(albums.map(processAlbum));
            ctx.body = albums;
        }
    ));
}

function album(){
    return route.get('/album/:id', json(
        async(ctx, id) => {
            let record = await c('albums').findOne({
                id: id
            });
            record = await processAlbum(record);
            ctx.body = record;
        }
    ));
}

let processAlbum = album => co(function *() {
    //album.url = `/gallery/{year}{course}{album}`
    //    .replace('{year}', album.date.getFullYear())
    //    .replace('{course}', album.course_uri)
    //    .replace('{album}', album.uri);
    album.url = `/album/${album.id}`;

    //album.content = yield album.content.map(product_id => co(function *() {
    //    let product = yield c('products').findOne({_id: product_id});
    //    if (product) return product;
    //    else return null;
    //}));

    //let teacher = yield c('collective').findOne({id: album.teacher});
    //album.teacher = teacher.name;

    let previewImageId = album.images[0];
    let image = yield c('images').findOne({_id: previewImageId});
    album.preview = image.data.medium;

    return album;
});