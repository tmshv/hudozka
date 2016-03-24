import EndPoint from './EndPoint';

export default class Feed extends EndPoint {
    add(post) {
        return this.request.request('PUT', '/feed', post);
    }
}
