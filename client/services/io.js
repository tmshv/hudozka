/**
 * Created by tmshv on 15/03/15.
 */

module.exports = function (app) {
    var socket = io();

    app.service("io", function(){
        return socket;
    })
};