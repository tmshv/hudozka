import {api} from '../instagram';

export default function () {
    return async(ctx, next) => {
        var code = ctx.session.accessToken;
        if (code) {
            ctx.instagram = api(code);
        }

        await next();
    }
}
