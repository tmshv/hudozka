/**
 * Created by tmshv on 22/11/14.
 */

function APIFeed(http){
    this.request = http;
}

APIFeed.prototype.feed = function() {
    return this.request.get("/news");
};

module.exports = APIFeed;