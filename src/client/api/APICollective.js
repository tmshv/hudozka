import EndPoint from './EndPoint';

export default class APICollective extends EndPoint {
    collective(sort=null) {
        let url = '/collective';
        if(sort) url = `/collective?sort=${sort.join(',')}`;
        return this.request.get(url, {cache: true});
    }
}