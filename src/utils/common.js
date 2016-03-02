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

/**
 * Select an item in Array by specified selector function
 * @param scope
 * @param selector
 * @returns {*}
 */
export function choise(scope, selector){
    return scope.reduce(selector, null);
}

export function unique(fn) {
    return list => [...new Set(list.map(fn))];
}

export function branch(fn) {
    let keys = unique(fn);

    return list => keys(list)
        .reduce((dict, key) => {
            dict[key] = list.filter(
                i => fn(i) === key
            );

            return dict;
        }, {})

}

export function assign(dict, key, value){
    dict[key] = value;
    return dict;
}

export function map(v, fn) {
    return value => fn(value) ? v : value;
}
