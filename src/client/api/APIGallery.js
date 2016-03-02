import EndPoint from './EndPoint';

export default class APIGallery extends EndPoint {
    year(year) {
        return this.get(`/gallery/${year}`);
    }

    album(year, course, album, doPopulate) {
        let url = `/gallery/${year}/${course}/${album}?populate=${doPopulate}`;
        return this.get(url);
    }
}
