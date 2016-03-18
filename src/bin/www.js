require('babel-core/register');
require('babel-polyfill');

var config = require("../config").default;
var db = require("../core/db");
var app = require("../server").app;

db.init(config.db.uri)
    .then(function () {
        app.listen(config.port);
    });
