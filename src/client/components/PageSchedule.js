import template from '../../templates/components/page-schedule.html';
import APISchedule from '../api/APISchedule';

export default function (app) {
    app.component('pageSchedule', {
        template: template,
        bindings: {
            schedules: '<'
        },
        controller: function($http, $location, $routeParams, api, menu) {
            menu.activate('/schedule');

            const period = $routeParams.period;
            const semester = $routeParams.semester;
            const useRoute = Boolean(period) && Boolean(semester);

            const stringPeriod = period => period.join('-');

            this.loadSchedule = (record, doUpdateUrl) => {
                let id = record._id;
                let scheduleItem = getScheduleById(id);
                if (scheduleItem) {
                    let p = scheduleItem.period.join('-');
                    let s = scheduleItem.semester;
                    api.schedule.fetch(p, s, true)
                        .then(i => i.data)
                        .then(i => {
                            this.schedule = i;
                            if (doUpdateUrl) $location.url(APISchedule.buildScheduleUrl(p, s));
                        });
                }
            };

            const getScheduleById = id => this.schedules
                .find(i => i._id === id);

            const getSchedule = (period, semester) => this.schedules
                .find(i => stringPeriod(i.period) === period && i.semester === semester);

            let last = list => list.length ? list[list.length - 1] : null;
            let getDefaultSchedule = list => last(list);

            let word = semester => [['spring', 'Весна'], ['autumn', 'Осень']]
                .find(i => i[0] === semester)
                [1];

            this.schedules.forEach(i => {
                let periodIndex = i.semester === 'spring' ? 1 : 0;
                let year = i.period[periodIndex];
                i.text = `${word(i.semester)} ${year} года`;
            });

            this.currentSchedule = useRoute ? getSchedule(period, semester) : getDefaultSchedule(this.schedules);
            if(this.currentSchedule) this.loadSchedule(this.currentSchedule, useRoute);
        }
    });
};