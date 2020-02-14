/**
 *
 * f([x, y, z, ...]) -> f(v) -> {v.x, v.y, v.z}
 *
 * @param fields
 * @returns {function(*): *}
 */
export function select(fields=[]){
    return i => fields.reduce((out, key) => {
        out[key] = i[key];
        return out;
    }, {});
}
