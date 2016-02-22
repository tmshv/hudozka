import {populate} from '../../utils/populate';
import {getCourseNameByID} from '../../models/course';
import {indexEquals} from '../../utils/common';
import {select, choise} from '../../utils/common';

function isRequested(period, semester) {
    return function (schedule) {
        return schedule.period === period && schedule.semester === semester;
    }
}

export default function (app) {
    app.controller('ScheduleController', ($scope, $http, $location, $routeParams, scheduleData, team, menu) => {
        menu.activate('/schedule');

        let current_period = $routeParams.period;
        let current_semester = $routeParams.semester;
        let isScheduleRequested = current_period && current_semester;

        let getScheduleByID = (id) => choise(
            $scope.schedules,
            select(i => i._id === id)
        );

        $http.get('/schedules', {cache: true})
            .success(schedules => {
                // By url params or last element
                let selector = isScheduleRequested ? isRequested(current_period, current_semester) : indexEquals(schedules.length - 1);

                schedules = schedules.map(schedule => {
                    let sem = [['spring', 'Весена'], ['autumn', 'Осень']]
                        .reduce(select(
                            i => i[0] === schedule.semester,
                            i => i[1]
                        ));
                    schedule.text = `${sem} ${schedule.period} года`;

                    return schedule;
                });

                schedules.forEach(function (schedule, i) {
                    if (selector(schedule, i)) {
                        $scope.currentSchedule = schedules[i];
                    }
                });

                $scope.schedules = schedules;
                $scope.loadSchedule($scope.currentSchedule, isScheduleRequested);
            });

        $scope.loadSchedule = (s, updateURL) => {
            let id = s._id;
            let schedule_item = getScheduleByID(id);

            if (schedule_item) {
                let sem = schedule_item.semester;
                let period = schedule_item.period;

                let url = `/schedule/${period}/${sem}`;
                $http.get(url, {cache: true})
                    .success(scheduleRecord => {
                        $scope.groups = scheduleData.populate(scheduleRecord.schedule, [
                            populate(team.short, 'teacher'),
                            populate(getCourseNameByID, 'lesson')
                        ]);

                        if (updateURL) $location.url(url);
                    });
            }
        };
    });
};
