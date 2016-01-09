/**
 * Created by tmshv on 15/03/15.
 */

module.exports = function (app) {
    var socket;
    function init(){
        socket = io();
    }

    app.service("io", function () {
        if (!socket) init();
        return socket;
    }); 
};