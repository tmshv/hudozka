import {readFileSync} from 'fs';

const env = process.env['NODE_ENV'] || 'production';
const isProduction = env === 'production';

let privatePath = '../.private';
let privateData = JSON.parse(
    readFileSync(privatePath, 'utf-8')
);

export const port = isProduction ? 18000 : 3000;
export const pathPrefix = isProduction ? '/service/instagram' : '';
export const indexPath = '../build/main.html';

export const clientId = privateData['clientId'];
export const clientSecret = privateData['clientSecret'];
export const redirectUri = privateData['redirectUri'];

export const serviceHost = isProduction ? 'http://localhost:1800' : 'http://localhost:8080';
export const serviceName = 'instagram';
export const serviceSecret = privateData['serviceSecret'];

export const jwtSecret = privateData['jwtSecret'];

export const sessionSecret = privateData['sessionSecret'];
export const sessionExpirationTime = 60 * 60 * 24 * 2; // two days in seconds

export const authScope = [
    'basic',
    // 'public_content',
    // 'follower_list',
    'comments',
    // 'relationships',
    'likes'
];

export const postType = 'instagram-2';
export const fetchItemsPerUpdateLoop = 1;
export const updateSubscriptionDelay = 1000 * 60 * 60; // one hour in milliseconds
export const updateSubscriptionCallbackUrl = isProduction ? `https://art.shburg.org${pathPrefix}/callback/hudozka` : 'http://dev.tmshv.ru/callback/hudozka';

export const database = {
    host: 'localhost',
    port: 27017,
    db: 'hudozka',
    username: '',
    password: ''
};

export const databaseUri = `mongodb://${database.host}:${database.port}/${database.db}`;
