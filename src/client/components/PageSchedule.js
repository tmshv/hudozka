import template from '../../templates/components/page-schedule.html';
import APISchedule from '../api/APISchedule';
import {populate} from '../../utils/populate';
import {getCourseNameByID} from '../../models/course';
import {indexEquals} from '../../utils/common';
import {select, choise} from '../../utils/common';

export default function (app) {
    app.component('pageSchedule', {
        template: template,
        bindings: {
            //currentSchedule: '<',
            schedules: '<'
        },
        controller: function($http, $location, $routeParams, api, menu) {
            this.pageClass = 'page-schedule';
            menu.activate('/schedule');

            const period = $routeParams.period;
            const semester = $routeParams.semester;
            const useRoute = period && semester;

            this.loadSchedule = (record, doUpdateURL) => {
                let id = record._id;
                let scheduleItem = getScheduleByID(id);
                if (scheduleItem) {
                    let p = scheduleItem.period;
                    let s = scheduleItem.semester;
                    api.schedule.fetch(p, s, true)
                        .then(i => i.data)
                        .then(i => {
                            this.schedule = i.schedule;
                            if (doUpdateURL) $location.url(APISchedule.buildScheduleUrl(p, s));
                        });
                }
            };

            let getScheduleByID = id => this.schedules
                .find(i => i._id === id);

            let getRoutedSchedule = list => {
                return list.find(i => i.period === period && i.semester === semester)
            };

            let last = list => list.length ? list[list.length - 1] : null;
            let getDefaultSchedule = list => last(list);

            let word = semester => [['spring', 'Весна'], ['autumn', 'Осень']]
                .find(i => i[0] === semester)
                [1];

            this.schedules.forEach(i => {
                let periodIndex = i.semester === 'spring' ? 1 : 0;
                let year = i.period.split('-')[periodIndex];
                i.text = `${word(i.semester)} ${year} года`;
            });
            this.currentSchedule = useRoute ? getRoutedSchedule(this.schedules) : getDefaultSchedule(this.schedules);

            this.loadSchedule(this.currentSchedule, useRoute);
        }
    });
};