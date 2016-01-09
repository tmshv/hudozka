/**
 * Created by tmshv on 22/11/14.
 */

function APIGallery(http){
    this.request = http;
}

APIGallery.prototype.year = function(year) {
    return this.request.get("/gallery/" + year, {cache: true});
};

APIGallery.prototype.album = function(year, course, album) {
    var url = '/gallery/{year}/{course}/{album}'
        .replace('{year}', year)
        .replace('{course}', course)
        .replace('{album}', album);

    return this.request.get(url, {cache: true});
};

module.exports = APIGallery;