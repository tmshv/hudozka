let contains = (list, i) => list.indexOf(i) > -1;

export function queryValue(params) {
    let keys = Object.keys(params);

    return async (ctx, next) => {
        let query = ctx.request.query;
        ctx.request.query = Object.keys(query)
            .reduce((q, i) => {
                if(contains(keys, i)){
                    let fn = params[i];
                    q[i] = fn(q[i]);
                }
                return q;
            }, query);

        await next();
    };
}

export function booleanify(){
    return function(value){
        if(value == 'true') return true;
        if(value == '1') return true;
        if(value == 'false') return false;
        if(value == '0') return false;
        return Boolean(value);   
    }
}

export function arrayify(sep){
    return function(value){
        return value.split(sep);
    }
}
