import fs from 'fs';
import path from 'path';

const privateFile = process.env['PRIVATE'] || 'private.json';
const privateData = JSON.parse(fs.readFileSync(privateFile, 'utf-8'));

const indexFile = process.env['INDEX'] || 'templates/main.html';
const port = process.env['PORT'] || 1800;

const config = {
    port: port,
    pub: './',

    db: {
        uri: 'mongodb://localhost:27017/hudozka'
    },

    prerender: {
        prerender: 'http://service.prerender.io/',
        prerenderToken: '',
        protocol: 'https',
        host: 'art.shlisselburg.org'
    }
};

export default Object.keys(privateData)
    .reduce((config, key) => {
        config[key] = privateData[key];
        return config;
    }, config);

let redirectPath = path.join(__dirname, '../redirect.tsv');
export const redirectionTable = fs.readFileSync(redirectPath, 'utf-8')
    .split('\n')
    .map(row => row.split(/\s+/))
    .map(row => {
        let [from, to] = row;
        return {
            'url': from,
            'redirect': to
        }
    });

export const name = 'Hudozka';
export const host = 'art.shlisselburg.org';
export const protocol = 'https://';
export const homeUrl = protocol + host;

export const index = path.join(__dirname, indexFile);
export const sitemapCacheTime = 600000;// 600 sec - cache purge period

export const instagramToken = privateData['instagramToken'];

export const viewMain = path.join(__dirname, 'views/main.hbs')
export const view404 = path.join(__dirname, 'views/404.hbs')
