import fs from 'mz/fs';
import compose from 'koa-compose';
import route from 'koa-route';
import {indexPath, pathPrefix as  root} from '../config';

import main from './main';
import {auth, authCallback, authOut} from './auth';
import {list, addTag, addUser} from './subscription';
import {ensureAuth} from './auth';
import {callbackGet, callbackPost} from './callback';

export function statelessRouters() {
    return compose([
        callbackGet(),
        callbackPost()
    ]);
}

export function routers() {
    return compose([
        main(),
        auth(),
        authCallback(),
        authOut(),
        user(),
        list(),
        addTag(),
        addUser()
    ]);
}

export const url = path => `${root}${path}`;
export const get = (path, fn) => route['get'](url(path), fn);
export const post = (path, fn) => route['post'](url(path), fn);

export function index(fn){
    return async function (ctx){
        ctx.type = 'text/html';
        ctx.body = await fs.createReadStream(indexPath);
    }
}

function user(){
    return compose([
        ensureAuth(),
        get('/user', async (ctx) => {
            const user = ctx.session.user.id;
            const instagram = ctx.instagram;

            let data = await instagram.user.mediaRecent(user);

            console.log(data);
            ctx.body = data;
        })
    ]);
}
