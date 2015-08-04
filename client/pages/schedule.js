var populate = require("../../utils/populate").populate;
const course = require("../../models/course");

module.exports = function (app) {
    app.controller("ScheduleController", function ($scope, $http, schedule, team) {
        var now = new Date();
        var dates = getDates(now);

        $http.get("/schedules")
            .success(function (schedules) {
                //return ;
                var last = schedules.length - 1;

                $scope.schedules = schedules.map(function (schedule) {
                    var sem = [["spring", "весеннего"], ["autumn", "осеннего"]].reduce(function (s, word) {
                        if (word[0] === schedule.semester) return word[1];
                        else return s[1];
                    });

                    schedule.text = 'Расписание {{sem}} семестра {{period}} года'
                        .replace('{{sem}}', sem)
                        .replace('{{period}}', schedule.period);

                    return schedule;
                });
                $scope.schedules[last].selected = true;
                $scope.currentSchedule = $scope.schedules[last]._id;
                $scope.loadSchedule();
            });

        $scope.$watch('currentSchedule', function (newValue) {

        });

        $scope.loadSchedule = function (id) {
            var schedule_item = getScheduleByID(id || $scope.currentSchedule);

            if(schedule_item) {
                var sem = schedule_item.semester;
                var period = schedule_item.period;

                $http.get("/schedule/" + period + "/" + sem)
                    .success(function (scheduleRecord) {
                        $scope.groups = schedule.populate(scheduleRecord.schedule, [
                            populate(team.short, "teacher"),
                            populate(course.name, "lesson")
                        ]);
                    });
            }
        };

        function getScheduleByID(id) {
            var schedules = $scope.schedules;
            for (var i in schedules) {
                var s = schedules[i];
                if (id === s._id) return s;
            }
            return null;
        }

        $scope.isToday = function (weekDayIndex) {
            return (now.getDay() - 1) === weekDayIndex;
        };

        $scope.weekDay = function (weekDayIndex) {
            return dates[weekDayIndex];
        };

        $(window).scroll(function () {
            if ($(this).scrollTop() >= 220) {
                $(".schedule table thead").addClass("fix animated fadeInDown");
                $(".schedule table tbody").addClass("fix");
            } else {
                $(".schedule table thead").removeClass("fix animated fadeInDown");
                $(".schedule table tbody").removeClass("fix");
            }
        });
    });
};

/**
 * Generates list of numbers
 * @param  {Number} start starting value
 * @param  {Number} num   amount of numbers in list
 * @param  {Number} step  difference value
 * @return {Array}        list of numbers
 */
function range(start, num, step) {
    var list = [];
    var val = start;
    for (var i = 0; i < num; i++) {
        list.push(val);
        val += step;
    }
    return list;
}

///**
// * Monday date of current week
// * @param  {[type]} d [description]
// * @return {[type]}   [description]
// */
//function getMonday(d) {
//    d = new Date(d);
//    var day = d.getDay();
//    var diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
//    return new Date(d.setDate(diff));
//}

function getDates(start) {
    var day = start.getDay();
    return range(0, 6, 1).reduce(function (dates, weekDay) {
        var d = 1 + weekDay - day;
        var time = start.getTime() + (1000 * 60 * 60 * 24) * d;
        var date = new Date(time);
        dates.push(date.getDate());
        return dates;
    }, []);
}