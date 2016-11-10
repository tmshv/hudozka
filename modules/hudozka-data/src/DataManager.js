import Timeline from './Timeline';
import Schedule from './Schedule';

export default class DataManager {
    constructor(stores) {
        this.timeline = new Timeline(stores.timeline);
        this.schedule = new Schedule(stores.schedules);
    }
}
