import EndPoint from './EndPoint';

export default class APISchedule extends EndPoint {
    static buildScheduleUrl(period, semester) {
        return `/schedule/${period}/${semester}`;
    }

    fetch(period, semester, doPopulate=true) {
        let url = `/schedule/${period}/${semester}?populate=${doPopulate}`;
        return this.get(url);
    }

    list() {
        let url = '/schedule/list';
        return this.get(url);
    }
}