import {databaseUri, port, updateSubscriptionDelay, updateSubscriptionCallbackUrl} from './config'
import {connect} from './core/db';
import server from './server';
import update from './core/update';
import {updateSubscription, clearSubscriptions} from './core/update';

connect(databaseUri)
    .catch(error => {
        console.log(error);
    })
    .then(() => {
        let app = server();
        app.listen(port);
    })
    .then(() => {
        console.log(`Start listening ${port}`);
    })
    .then(clearSubscriptions)
    .then(() => {
        let repeat = time => fn => setInterval(fn, time);

        updateSubscription(updateSubscriptionCallbackUrl);
        repeat(updateSubscriptionDelay)(() => {
            updateSubscription(updateSubscriptionCallbackUrl);
        });
    });
    // .then(() => {
    //     return update('hudozka', {
    //         "changed_aspect": "media",
    //         "object": "tag",
    //         "object_id": "love",
    //         // "time": 1458675620,
    //         "time": 1458594000,
    //         "subscription_id": 22487204,
    //         "data": {}
    //     })
    //         .catch(e => {
    //             console.log(e);
    //         })
    //         .then(result => {
    //             console.log('update done');
    //             console.log(result);
    //         });
    // })
