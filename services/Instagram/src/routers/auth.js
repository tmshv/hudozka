import {get, url} from './';
import {authorize, createAuthorizationUrl} from '../instagram';
import {redirectUri, authScope} from '../config';
import {authorizeUser} from '../core/auth';

export function auth() {
    return get('/auth', async(ctx) => {
        const state = url('/');
        const i = createAuthorizationUrl(redirectUri, authScope, state);
        ctx.redirect(i, state);
    });
}

export function authCallback() {
    const root = url('/');

    return get('/auth/callback', async(ctx) => {
        let state = ctx.query.state;
        let code = ctx.query.code;

        if(!ctx.session.accessToken) {
            try{
                var client = await authorize(code, redirectUri);
            }catch (e){
                console.log(e);
            }

            if (client){
                var user = await authorizeUser(client.access_token, client.user);
                var accessToken = client.access_token;
            }

            ctx.status = user ? 200 : 401;
            ctx.session.user = user;
            ctx.session.accessToken = accessToken;
        }

        ctx.redirect(state, root);
    });
}

export function authOut(redirectUrl = '/') {
    const redirectTo = url(redirectUrl);
    const root = url('/');

    return get('/auth/out', async(ctx) => {
        ctx.session = null;
        ctx.redirect(redirectTo, root);
    });
}

export function ensureAuth(failRedirect = '/') {
    const redirectTo = url(failRedirect);
    const root = url('/');
    
    return async (ctx, next) => {
        if(!ctx.session.user) {
            ctx.redirect(redirectTo, root)
        }else{
            await next();
        }
    }
}
