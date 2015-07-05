/**
 * Created by tmshv on 21/11/14.
 */

module.exports = function(app) {
    app.filter("strip", function () {
        return function(string) {
            return string
                .replace(/^\s+/, '')
                .replace(/\s+$/, '');
        };
    });
};
