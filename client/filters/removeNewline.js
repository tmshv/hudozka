/**
 * Created by tmshv on 21/11/14.
 */

module.exports = function(app) {
    app.filter("removeNewline", function () {
        return function(string) {
            return string.replace(/(\n)/g, ' ');
        };
    });
};
