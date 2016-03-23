require('babel-core/register');
require('babel-polyfill');

var config = require('./config').default;
var db = require('./core/db');

db.connect(config.db.uri)
    .then(function () {
        var server = require('./server').default;
        var io = require('./io').default;

        var app = server();
        io(app);
        app.listen(config.port);
    })
    .catch(function(e){
        console.error(e.stack);
    })
    .then(function(){
        console.log(`Start listening ${config.port}`);
    });
