/**
 * Created by tmshv on 22/11/14.
 */

import EndPoint from './EndPoint';

export default class APIGallery extends EndPoint {
    year(year) {
        return this.request.get(`/gallery/${year}`, {cache: true});
    }

    album(year, course, album) {
        let url = `/gallery/${year}/${course}/${album}`;
        return this.request.get(url, {cache: true});
    }
}
