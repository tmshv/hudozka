/**
 * Created by tmshv on 22/11/14.
 */

import {query} from '../../utils/net';

function APIFeed(http){
    this.request = http;
}

APIFeed.prototype.feed = function(count, portion) {
    return this.request.get("/news?"+query([["count", count], ["portion", portion]]));
};

module.exports = APIFeed;