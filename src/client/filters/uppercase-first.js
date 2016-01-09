/**
 * Created by tmshv on 21/11/14.
 */

module.exports = function(app) {
    app.filter("uppercaseFirst", function () {
        return function(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        };
    });
};
