var range = require('./common').range;

module.exports = {
    getDates: getDates
};

/**
 *
 * @param start
 * @returns {*}
 */
function getDates(start) {
    var day = start.getDay();
    return range(0, 6, 1).reduce(function (dates, weekDay) {
        var d = 1 + weekDay - day;
        var time = start.getTime() + (1000 * 60 * 60 * 24) * d;
        var date = new Date(time);
        dates.push(date.getDate());
        return dates;
    }, []);
}