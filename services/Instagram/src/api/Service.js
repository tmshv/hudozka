import  {EventEmitter} from 'events';
import Feed from './Feed';

export default class Service extends EventEmitter{
    constructor(secret) {
        super();

        this.secret = secret;
        this.feed = new Feed(this.request);
    }
    
    request(){
        
    }
}
