export default class EndPoint{
    constructor(http){
        this.request = http;
    }

    get(url){
        return this.request.get(url, {cache: true});
    }
}