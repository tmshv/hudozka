/**
 * Generates list of numbers
 * @param  {Number} start starting value
 * @param  {Number} num   amount of numbers in list
 * @param  {Number} step  difference value
 * @return {Array}        list of numbers
 */
export function range(start, num, step) {
    var list = [];
    var val = start;
    for (var i = 0; i < num; i++) {
        list.push(val);
        val += step;
    }
    return list;
}

/**
 * Return a closure that compares a Number argument with specified Number
 * @param withNumber Number to compare with
 * @returns {Function} (i) => {}
 */
export function numberEquals(withNumber) {
    return i => i === withNumber;
}

/**
 * Return a closure that compares a second Number argument with specified Number
 * @param withNumber Number to compare with
 * @returns {Function} (i) => {}
 */
export function indexEquals(withNumber) {
    return (_, i) => i === withNumber;
}

/**
 * Return a reduce function
 * [['spring', 'Весена'], ['autumn', 'Осень']] -> 'Весна' or 'Осень' depend on byCondition result
 * @param byCondition
 * @param map
 */
export function select(byCondition, map = i => i) {
    return (result, item) => byCondition(item) ? map(item): map(result)
}