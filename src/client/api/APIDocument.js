import EndPoint from './EndPoint';

export default class APIDocument extends EndPoint {
    documents(){
        let url = '/documents/type/document';
        return this.get(url);
    }

    awards() {
        let url = '/documents/type/award';
        return this.get(url);
    }

    id(id){
        let url = `/documents/${id}`;
        return this.get(url);
    }
}