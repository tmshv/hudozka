import EndPoint from './EndPoint';

export default class APIEvent extends EndPoint {
    list(skip=1, limit=10) {
        let url = `/events?skip=${skip}&limit=${limit}`;
        return this.request.get(url, {cache: true});
    }

    post(id) {
        let url = `/event/${id}`;
        return this.request.get(url, {cache: true});
    }
}