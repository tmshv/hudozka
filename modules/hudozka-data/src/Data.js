import {EventEmitter} from 'events';

export default class Data extends EventEmitter {
    constructor(store) {
        super();
        this.save = true;
        this.store = store;
    }

    update(document) {
        this.emit('update', document);
    }

    disableSaving() {
        this.save = false;
    }

    enableSaving() {
        this.save = true;
    }
}
