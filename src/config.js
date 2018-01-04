import path from 'path'

export const port = process.env['PORT'] || 3000
export const dbUri = process.env['DB_URI'] || 'mongodb://localhost:27017/hudozka'

export const name = 'Hudozka'
export const host = 'art.shlisselburg.org'
export const protocol = 'https://'
export const homeUrl = protocol + host

export const index = path.join(__dirname, 'templates/main.html')
export const sitemapCacheTime = 600000// 600 sec - cache purge period

export const viewMain = path.join(__dirname, 'views/main.hbs')
export const view404 = path.join(__dirname, 'views/404.hbs')

export const sessionConfig = {
	key: 'sid', /** (string) cookie key */
	maxAge: 86400000, /** (number) maxAge in ms */
	overwrite: false, /** (boolean) can overwrite or not */
	httpOnly: false, /** (boolean) httpOnly or not */
	signed: true, /** (boolean) signed or not  */
}
