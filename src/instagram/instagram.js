var EventEmitter = require("events").EventEmitter;
var thunkify = require("thunkify");
import config from "../config";
var db = require("../core/db");
var instagram = require("instagram-node");

function Instagram(options) {
    this.client_id = options.client_id;
    this.client_secret = options.client_secret;
    this.redirect_uri = options.redirect_uri;
    this.default_user = options.default_user;
    this.clients = {};
    this.users = {};

    EventEmitter.call(this);
}

Instagram.prototype = Object.create(EventEmitter.prototype);

Instagram.prototype.authorizationURL = function (scope, state) {
    var params = {};
    params.scope = scope || ["basic"];
    if (state) {
        params.state = state;
    }

    var client = createClient();
    return client["get_authorization_url"](this.redirect_uri, params);
};

Instagram.prototype.addClient = function *(code, params) {
    var token = params.access_token;
    var item = params.user;
    item.code = code;
    item.access_token = token;
    item.provider = "instagram";
    yield db.c("users").update({provider: "instagram", id: params.user.id}, item, {upsert: true});

    return this.initUser(item);
};

Instagram.prototype.initUser = function (user) {
    var token = user.access_token;
    this.clients[user.code] = createClient(token);
    this.users[user.code] = user;
    return this;
};

Instagram.prototype.getUsers = function () {
    var users = this.users;
    return Object.keys(users)
        .map(function (code) {
            return users[code];
        });
};

Instagram.prototype.update = function (body) {
    this.emit('update', body);
};

Instagram.prototype.client = function (code) {
    if (code && code in this.clients) {
        return this.clients[code];
    } else {
        return createClient();
    }
};

Instagram.prototype.user = function (code) {
    if (code && code in this.users) {
        return this.users[code];
    } else {
        return null;
    }
};

Instagram.prototype.authorize = function *(code) {
    var api = createClient();
    var authorize = thunkify(api["authorize_user"]);
    var result = yield authorize(code, this.redirect_uri);

    if (result) {
        yield this.addClient(code, result);
    }

    return result;
};

Instagram.prototype.getUser = function *() {
    if (this.default_user) {
        var du = yield db.c("users").findOne({username: this.default_user});
        if (du) {
            return du;
        }
    }

    return yield db.c("users").findOne({provider: "instagram"});
};

Instagram.prototype.getUsers = function *() {
    return yield db.c("users").find({provider: "instagram"}).toArray();
};

Instagram.prototype.api = {
    subscriptions: function *() {
        var ig = createClient();
        var subs = thunkify(ig["subscriptions"]);
        try {
            var s = yield subs();
            return s[0];
        } catch (error) {
            return null;
        }
    },

    subscribe: function *(tag, callbackURL) {
        var ig = createClient();
        var sub = thunkify(ig["add_tag_subscription"]);
        try {
            var s = yield sub(tag, callbackURL);
            return s[0];
        } catch (error) {
            return null;
        }
    },

    unsubscribe: function *(id) {
        var ig = createClient();
        var sub = thunkify(ig["del_subscription"]);
        try {
            var s = yield sub({id: id});
            return s[0];
        } catch (error) {
            return null;
        }
    },

    tagMediaRecent: function *(client, tag, count) {
        var tag_media_recent = thunkify(client["tag_media_recent"]);

        try{
            var result = yield tag_media_recent(tag, {count: count});
            return {
                medias: result[0],
                pagination: result[1],
                remaining: result[2],
                limit: result[3]
            }
        }catch(error){
            return null;
        }
    }
};

module.exports = new Instagram(config.instagram);

function createClient(token) {
    var client = instagram.instagram({}, {});
    if (token) {
        client.use({access_token: token});
    } else {
        client.use({
            client_id: config.instagram.client_id,
            client_secret: config.instagram.client_secret
        });
    }
    return client;
}