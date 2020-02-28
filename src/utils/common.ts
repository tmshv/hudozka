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
    return (result, item) => byCondition(item) ? map(item) : map(result)
}

/**
 * Select an item in Array by specified selector function
 * @param scope
 * @param selector
 * @returns {*}
 */
export function choise(scope, selector) {
    return scope.reduce(selector, null);
}

export function assign(dict, key, value) {
    dict[key] = value;
    return dict;
}

export function map(v, fn) {
    return value => fn(value) ? v : value;
}

/**
 *
 * f(g, [x, y, z, ...]) => map of {g(x): x, g(y): y, g(z): z}
 *
 * @param list
 * @param selector
 * @returns {*}
 */
export function createMap(selector, list) {
    return list.reduce((map, i) => map.set(selector(i), i), new Map());
}

/**
 *
 * f(g) => x ? g(x) : null
 *
 * @param {function} fn
 * @returns {function(*=): null}
 */
export function nullSafe(fn) {
    return i => i ? fn(i) : null;
}
