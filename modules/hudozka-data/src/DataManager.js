import Timeline from './Timeline';

export default class DataManager {
    constructor(stores) {
        this.timeline = new Timeline(stores.timeline);
    }
}
