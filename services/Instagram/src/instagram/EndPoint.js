export default class EndPoint{
    constructor(client) {
        this.client = client;
    }
    
    method(name){
        return this.client[name];
    }
}