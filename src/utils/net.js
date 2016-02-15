/**
 * Created by tmshv on 08/03/15.
 */

export function query(list) {
    var params = list.reduce(function (query, param) {
            var q = param[0] + "=" + param[1];
            query.push(q);
            return query;
        }, [])
        .join("&");
    return params
}
