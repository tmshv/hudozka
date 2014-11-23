/**
 * Created by tmshv on 22/11/14.
 */

function APIFeed(http){
    this.request = http;
}

APIFeed.prototype.post = function() {
    return this.request.get("/api/feed");
};

module.exports = APIFeed;