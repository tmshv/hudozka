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

export const serviceSecret = privateData['serviceSecret'];

export const authScope = [
    'basic',
    // 'public_content',
    // 'follower_list',
    'comments',
    // 'relationships',
    'likes'
];

export const sessionSecret = privateData['sessionSecret'];
// export const sessionExpirationTime = 60 * 60 * 24 * 2; // two days in seconds
export const sessionExpirationTime = 10; // 10 seconds

export const database = {
    host: 'localhost',
    port: 27017,
    db: 'hudozka',
    username: '',
    password: ''
};

export const databaseUri = `mongodb://${database.host}:${database.port}/${database.db}`;

