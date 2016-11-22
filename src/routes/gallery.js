import compose from 'koa-compose';
import route from 'koa-route';
import {c} from '../core/db';
import {json} from './';

export default function () {
    return compose([
        gallery(),
        album()
    ]);
};

function gallery() {
    return route.get('/gallery', json(
        async(ctx) => {
            let query = {};
            let albums = await c('albums')
                .find(query)
                .toArray();

            ctx.body = await Promise.all(albums
                .sort((a, b) => {
                    const da = a.date.getTime();
                    const db = b.date.getTime();
                    return db - da;
                })
                .map(processAlbum)
            );
        }
    ));
}

function album() {
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

const processAlbum = async album => {
    album.url = `/album/${album.id}`;

    const previewFromImage = imgs => imgs.length ? imgs[0] : null;
    const previewImageId = album.preview ? album.preview : previewFromImage(album.images);
    if (previewImageId) {
        const image = await c('images').findOne({_id: previewImageId});
        album.preview = image.data.medium;
    }

    return album;
};
