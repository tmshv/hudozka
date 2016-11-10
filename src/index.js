import 'babel-polyfill';

import config from './config';
import {name} from './config';
import {connect, collection} from './core/db';
import io from './io';
import server from './server';

import DataManager from 'hudozka-data';
// var DataManager = require('hudozka-data').default;

function main() {
    async function loop() {
        const db = config.db.uri;
        await connect(db);

        try {
            let data = new DataManager({
                timeline: collection('timeline'),
                schedules: collection('schedules')
            });

            let app = server(data);
            io(app, data);

            app.listen(config.port);
        } catch (e) {
            console.error(e.stack);
            return;
        }

        console.log(`App ${name} started`);
        console.log(`listening ${config.port}`);
        console.log(`db address ${db}`);
    }

    loop();
}

main();
