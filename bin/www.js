/**
 * Created by tmshv on 22/11/14.
 */

var config = require("../config");
var db = require("../core/db");
var server = require("../server");

db.init(config.db)
    .then(function () {
        server(config.port);
    });