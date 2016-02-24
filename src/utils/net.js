export function query(list) {
    return list
        .reduce(
            (query, param) => query.concat([`${param[0]}=${param[1]}`]),
            []
        )
        .join('&');
}
