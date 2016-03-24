import {EventEmitter} from 'events';
import {collection} from '../core/db';

export default class Data extends EventEmitter {
    constructor(storeName) {
        super();
        this.save = true;
        this.name = storeName;
        this.store = collection(storeName);
    }
    
    update(document){
        this.emit('update', document);
    }
    
    disableSaving(){
        this.save = false;
    }

    enableSaving(){
        this.save = true;
    }
}
