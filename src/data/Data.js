import {EventEmitter} from 'events';
import {collection} from '../core/db';

export default class Data extends EventEmitter {
    constructor(storeName) {
        super();
        this.name = storeName;
        this.store = collection(storeName);
    }
    
    update(document){
        this.emit('update', document);
    }
}
