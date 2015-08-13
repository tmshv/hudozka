var populate = require('../../utils/populate').populate;
const course = require('../../models/course');

function indexEquals(i) {
    return function (_, index) {
        return i === index;
    }
}

function isRequested(period, semester) {
    return function (schedule) {
        return schedule.period === period && schedule.semester === semester;
    }
}

module.exports = function (app) {
    app.controller('MobileScheduleController', function ($scope, $http, $location, $routeParams, schedule, team) {
        var current_period = $routeParams.period;
        var current_semester = $routeParams.semester;
        var isScheduleRequested = current_period && current_semester;

        $http.get("/schedules", {cache: true})
            .success(function (schedules) {
                // By url params or last element
                var select_fn = isScheduleRequested ? isRequested(current_period, current_semester) : indexEquals(schedules.length - 1);

                schedules = schedules.map(function (schedule) {
                    var sem = [['spring', 'Весена'], ['autumn', 'Осень']].reduce(function (s, word) {
                        if (word[0] === schedule.semester) return word[1];
                        else return s[1];
                    });
                    schedule.text = `${sem} ${schedule.period} года`;

                    return schedule;
                });

                schedules.forEach(function (schedule, i) {
                    if (select_fn(schedule, i)) {
                        $scope.currentSchedule = schedules[i];
                    }
                });

                $scope.schedules = schedules;
                $scope.loadSchedule($scope.currentSchedule, isScheduleRequested);
            });

        $scope.loadSchedule = function (s, updateURL) {
            var id = s._id;
            var schedule_item = getScheduleByID(id);

            if (schedule_item) {
                var sem = schedule_item.semester;
                var period = schedule_item.period;

                var url = `/schedule/${period}/${sem}`;
                $http.get(url, {cache: true})
                    .success(function (scheduleRecord) {
                        $scope.groups = schedule.populate(scheduleRecord.schedule, [
                            populate(team.short, 'teacher'),
                            populate(course.name, 'lesson')
                        ]);

                        if (updateURL) {
                            $location.url(url);
                        }
                    });
            }
        };

        function getScheduleByID(id) {
            var schedules = $scope.schedules;
            for (var i = 0, l = schedules.length; i < l; i++) {
                var s = schedules[i];
                if (id === s._id) return s;
            }
            return null;
        }
    });
};