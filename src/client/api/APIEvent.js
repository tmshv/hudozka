import EndPoint from './EndPoint';

export default class APIEvent extends EndPoint {
    list(page = 1) {
        let limit = 5;
        let skip = (page - 1) * limit;

        let url = `/events?skip=${skip}&limit=${limit}`;
        return this.get(url);
    }

    post(id) {
        let url = `/event/${id}`;
        return this.get(url);
    }
}