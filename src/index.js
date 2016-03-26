import 'babel-polyfill';

import config from './config';
import {connect, collection} from './core/db';
import io from './io';
import server from './server';

import DataManager from 'hudozka-data';
// var DataManager = require('hudozka-data').default;

function main() {
    async function loop() {
        await connect(config.db.uri);

        try {
            let data = new DataManager({
                timeline: collection('timeline')
            });

            let app = server(data);
            io(app, data);

            app.listen(config.port);
        } catch (e) {
            console.error(e.stack);
            return;
        }

        console.log(`Start listening ${config.port}`);
    }

    loop();
}

main();
