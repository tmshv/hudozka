import EndPoint from './EndPoint';

export default class APIGallery extends EndPoint {
    year(year) {
        return this.request.get(`/gallery/${year}`, {cache: true});
    }

    album(year, course, album, doPopulate) {
        let url = `/gallery/${year}/${course}/${album}?populate=${doPopulate}`;
        return this.request.get(url, {cache: true});
    }
}
