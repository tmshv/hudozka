import EndPoint from './EndPoint';

export default class APISchedule extends EndPoint {
    get(period, semester, doPopulate=true) {
        let url = `/schedule/${period}/${semester}?populate=${doPopulate}`;
        return this.request.get(url, {cache: true});
    }

    buildScheduleUrl(period, semester) {
        return `/schedule/${period}/${semester}`;
    }

    list() {
        let url = '/schedule/list';
        return this.request.get(url, {cache: true});
    }
}