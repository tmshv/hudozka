require('babel-core/register');
require('babel-polyfill');

var config = require("../config").default;
var db = require("../core/db");
var server = require("../server").server;

db.init(config.db.uri)
    .then(function () {
        var app = server();
        app.listen(config.port);
    });
