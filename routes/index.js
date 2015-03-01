/**
 * Created by tmshv on 01/03/15.
 */

var path = require("path");
var fs = require("mz/fs");

function accepts(routes, def) {
    return function *() {
        var req = this.request;
        var types = Object.keys(routes)
            .filter(function (type) {
                return req.accepts(type);
            });

        if (types.length) {
            var type = types[0];
            yield routes[type].apply(this, arguments);
        } else if(def){
            yield def;
        }else{
            this.status = 406;
        }
    };
}

function index(filename) {
    if (!filename){
        filename = path.join(__dirname, "../templates/index.html");
    }

    return function *() {
        this.type = "text/html";
        this.body = fs.createReadStream(filename);
    }
}

module.exports = {
    index: index,
    accepts: accepts
};
