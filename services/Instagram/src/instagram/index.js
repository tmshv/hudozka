import {instagram} from 'instagram-node';

import {clientId, clientSecret} from '../config';
import Instagram from './Instagram';

export function api(accessToken){
    return new Instagram(clientId, clientSecret, accessToken, createClient);
}

export function createAuthorizationUrl(redirectUri, scope, state) {
    let params = {
        scope: scope || ['basic']
    };
    if (state) params.state = state;

    let client = createClient(clientId, clientSecret);
    return client['get_authorization_url'](redirectUri, params);
}

export function authorize(code, redirectUri) {
    let api = createClient(clientId, clientSecret);
    let authorize = api['authorize_user'];

    return new Promise((resolve, reject) => {
        authorize(code, redirectUri, (error, user) => {
            if(error){
                reject(error);
            }else{
                resolve(user);
            }
        });
    });
}

function createClient(clientId, clientSecret, accessToken = null) {
    const client = instagram();
    client.use({
        client_id: clientId,
        client_secret: clientSecret
    });
    if (accessToken) client.use({access_token: accessToken});
    return client;
}
