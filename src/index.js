import 'babel-polyfill'

import {dbUri, port, name, configFile} from './config'
import {connect} from './core/db'
import server from './server'

function main() {
	async function loop() {
		await connect(dbUri)

		const Config = require('./core/Config')
		const config = await Config.findById('settings')

		try {
			let app = server(config)

			app.listen(port)
		} catch (e) {
			console.error(e.stack)
			return
		}

		console.log(`Using node ${process.version}`)
		console.log(`App ${name} started`)
		console.log(`Server: ${config.server}`)
		console.log(`Config file: ${configFile}`)
		console.log(`DB Address: ${dbUri}`)
		console.log(`Listening ${port}`)
	}

	return loop()
}

main()
