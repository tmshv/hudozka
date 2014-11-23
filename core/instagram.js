/**
 * Created by tmshv on 22/11/14.
 */

var config = require("../config");
var Promise = require("promise");

var auth_clients = {};

module.exports = {
    client: function(param){
        if(param in auth_clients) {
            return auth_clients[param];
        }else{
            return createClient();
        }
    },

    authorize: function(code){
        return new Promise(function(resolve, reject){
            var api = createClient();
            api.authorize_user(code, config.instagram.redirect_uri, function (err, result) {
                if (err) return reject(err);
                else {
                    var token = result.access_token;
                    var c = createClient(token);
                    auth_clients[code] = c;
                    resolve(c);
                }
            });
        });
    }
};

function createClient(token) {
    var api = require('instagram-node').instagram();
    if (token) {
        api.use({access_token: token});
    } else {
        api.use({
            client_id: config.instagram.client_id,
            client_secret: config.instagram.client_secret
        });
    }
    return api;
}