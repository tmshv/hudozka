require('babel-core/register');
require('babel-polyfill');

var config = require("../config").default;
var db = require("../core/db");
var app = require("../server").app;
var instagram = require("../instagram");

db.init(config.db.uri)
    //.then(instagram)
    .then(function () {
        app.listen(config.port);
    })
    .then(function () {
        return instagram()
            .then(function () {
                console.log('INSTAGRAM INITED');
            });
    });