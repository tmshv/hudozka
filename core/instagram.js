/**
 * Created by tmshv on 22/11/14.
 */

var config = require("../config");
var instagram = require("instagram-node");
var auth_clients = {};

module.exports = {
    client: function(code){
        if(code && code in auth_clients) {
            return auth_clients[code].client;
        }else{
            return createClient();
        }
    },

    user: function(code){
        if(code in auth_clients) {
            return auth_clients[code].user;
        }else{
            return null;
        }
    },

    authorize: function(code){
        return new Promise(function(resolve, reject){
            var api = createClient();
            api.authorize_user(code, config.instagram.redirect_uri, function (err, result) {
                if (err) return reject(err);
                else {
                    var user = result.user;
                    var token = result.access_token;
                    var client = createClient(token);

                    auth_clients[code] = {
                        client: client,
                        user: user
                    };

                    resolve(client);
                }
            });
        });
    }
};

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