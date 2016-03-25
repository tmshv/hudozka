import compose from 'koa-compose';
import {get} from './';
import {ensureAuth} from './auth';
import {push} from '../core/update';
import {postFromInstagramMedia} from '../models/post';

export function shortname() {
    return compose([
        ensureAuth(),
        get('/media/shortname/:name', async(ctx, name) => {
            const instagram = ctx.instagram;
            let result = await instagram.media.shortname(name);

            if(result.meta.code === 200) {
                let post = postFromInstagramMedia(result.data);
                console.log('SHORTNAME');

                ctx.set('Content-Type', 'application/json');
                ctx.body = await push(post);
            }
        })
    ]);
}
