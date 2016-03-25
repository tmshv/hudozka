import  request from 'request-promise';

export default class EndPoint{
    constructor(client, token) {
        this.client = client;
        this.token = token;
    }
    
    method(name){
        return this.client[name];
    }

    request(method, path, data=null) {
        let buildPath = path => `https://api.instagram.com/v1${path}`;
        let options = {
            method: method,
            uri: buildPath(path),
            headers: {}
        };
        
        if(data) options.body = data;
        return request(options)
            .then(i => JSON.parse(i));
    }
}
