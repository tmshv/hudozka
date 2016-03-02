import EndPoint from './EndPoint';

export default class APIAlbum extends EndPoint {
    list(){
        return this.get(`/gallery`);
    }

    year(year) {
        return this.get(`/gallery/${year}`);
    }

    fetch(id, doPopulate) {
        let url = `/album/${id}?populate=${doPopulate}`;
        return this.get(url);
    }
}
