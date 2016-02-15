/**
 * Created by tmshv on 22/11/14.
 */

require('babel-core/register');
require('babel-polyfill');

var config = require("../config");
var db = require("../core/db");
var server = require("../server");
var instagram = require("../instagram");

db.init(config.db.uri)
    //.then(instagram)
    .then(function () {
        var app = server();
        app.listen(config.port);
    });