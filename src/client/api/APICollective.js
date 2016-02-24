import EndPoint from './EndPoint';

export default class APICollective extends EndPoint {
    collective() {
        let url = '/collective';
        return this.request.get(url, {cache: true});
    }
}