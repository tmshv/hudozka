import fs from 'fs'
import path from 'path'

export const configFile = process.env['PRIVATE'] || 'private.json'
const privateData = JSON.parse(fs.readFileSync(configFile, 'utf-8'))

const indexFile = process.env['INDEX'] || 'templates/main.html'
export const port = process.env['PORT'] || 1800

const value = (name, def) => name in privateData
	? privateData[name]
	: def

const config = {
	pub: './',
}

export const dbUri = value('dbUri', 'mongodb://localhost:27017/hudozka')

export default Object.keys(privateData)
    .reduce((config, key) => {
	config[key] = privateData[key]
	return config
}, config)

export const name = 'Hudozka'
export const host = 'art.shlisselburg.org'
export const protocol = 'https://'
export const homeUrl = protocol + host

export const index = path.join(__dirname, indexFile)
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