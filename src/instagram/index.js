var db = require("../core/db");
var co = require("co");
var instagram = require("./instagram");
var config = require("../config");

export default function () {
    return co(function*() {
        yield loadUsers();

        let tags = config.instagram['tags'];
        console.log(tags);

        yield updateSubscription(['love']);
    });
};

function* loadUsers() {
    let users = yield db.c('users').find({provider: 'instagram'})
        .toArray();

    users.forEach(u => {
        instagram.initUser(u);
    });

    return users;
}

function* updateSubscription(tags) {
    console.log(tags);

    //return tags.map(tag => {
    //    let callbackUrl = config.instagram['tag_callback'];
    //
    //    return co(function *() {
    //        return yield instagram.api.subscribe(tag, callbackUrl);
    //    });
    //}

    return 1;
}
