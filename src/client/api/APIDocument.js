import EndPoint from './EndPoint';

export default class APIDocument extends EndPoint {
    documents(){
        let url = '/documents/type/document';
        return this.request.get(url, {cache: true});
    }

    awards() {
        let url = '/documents/type/award';
        return this.request.get(url, {cache: true});
    }
}