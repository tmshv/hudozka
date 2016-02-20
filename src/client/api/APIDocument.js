import EndPoint from './EndPoint';

export default class APIDocument extends EndPoint {
    awards() {
        let url = '/documents/awards';
        return this.request.get(url, {cache: true});
    }
}