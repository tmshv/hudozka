import {index, get} from './';

export default function () {
    return get('/', async (ctx) => {
        await index()(ctx);
    });
}
