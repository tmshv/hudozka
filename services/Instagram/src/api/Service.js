import  {stringify} from 'ejson';
import  {EventEmitter} from 'events';
import  request from 'request-promise';
import Feed from './Feed';

let json = i => stringify(i);

export default class Service extends EventEmitter{
    constructor(host, service, secret) {
        super();
        this.version = 'v1';
        this.host = host;
        this.service = service;
        this.secret = secret;
        this.feed = new Feed(this);
    }
    
    request(method, path, data) {
        let buildPath = path => `${this.host}/api/${this.version}${path}`;
        let options = {
            method: method,
            uri: buildPath(path),
            headers: {
                'Content-Type': 'application/ejson',
                'X-Service-Name': this.service,
                'X-Service-Token': this.secret
            },
            body: json(data)
        };

        return request(options);
    }
}
