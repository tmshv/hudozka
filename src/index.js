import 'babel-polyfill';

import config from './config';
import {connect} from './core/db';

function main() {
    async function loop(){
        await connect(config.db.uri);

        try{
            var server = require('./server').default;
            var io = require('./io').default;

            var app = server();
            io(app);
            app.listen(config.port);
        }catch(e){
            console.error(e.stack);
        }

        console.log(`Start listening ${config.port}`);
    }

    loop();
}

main();
