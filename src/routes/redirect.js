/**
 *
 * @param redirectionTable
 * [{String url, String redirect}, ...]
 * @returns {*}
 */
export function redirect(redirectionTable) {
    return function *(next) {
        let path = this.request.path;

        let record = redirectionTable.find(i => i.url === path);
        if(record){
            this.redirect(record.redirect);
            return;
        }

        yield next;
    };
}
