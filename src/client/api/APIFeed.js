/**
 * Created by tmshv on 22/11/14.
 */

import {query} from '../../utils/net';
import EndPoint from './EndPoint';

export default class APIFeed extends EndPoint{
    feed(count, portion) {
        let q = query([['count', count], ['portion', portion]]);
        return this.request.get(`/news?${q}`);
    }
}
