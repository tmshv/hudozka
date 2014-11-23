/**
 * Created by tmshv on 22/11/14.
 */

var mongoose = require("mongoose");
var Promise = require("promise");

module.exports = {
    init: function (options) {
        return new Promise(function (resolve, reject) {
            mongoose.connect(options.uri, function (error) {
                if (error) return reject(error);
                resolve();
            });
        });

    }
};