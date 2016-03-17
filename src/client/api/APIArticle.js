import EndPoint from './EndPoint';

export default class APIArticle extends EndPoint {
    id(id) {
        let url = `/article/${id}`;
        return this.get(url);
    }
}