import {query} from '../../utils/net';
import EndPoint from './EndPoint';

export default class APITimeline extends EndPoint{
    feed(limit=10, skip=0) {
        let q = query([['limit', limit], ['skip', skip]]);
        return this.get(`/news?${q}`);
    }
}
