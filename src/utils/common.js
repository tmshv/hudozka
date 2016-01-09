module.exports = {
    range: range
};

/**
 * Generates list of numbers
 * @param  {Number} start starting value
 * @param  {Number} num   amount of numbers in list
 * @param  {Number} step  difference value
 * @return {Array}        list of numbers
 */
function range(start, num, step) {
    var list = [];
    var val = start;
    for (var i = 0; i < num; i++) {
        list.push(val);
        val += step;
    }
    return list;
}