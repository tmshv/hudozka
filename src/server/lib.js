/**
 *
 * {a: {}, b: {}, ...} -> Map (a: Class, b: Class)
 *
 * @param Class
 * @param object
 */
exports.mapOf = function mapOf(Class, object) {
    return Object
        .entries(object)
        .reduce((map, i) => (
            map.set(i[0], new Class(i[1]))
        ), new Map())
}
