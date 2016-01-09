var pop = require("../utils/populate").pop;

const WEEK = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

module.exports = {
    populate: populateSchedule
};

function populateSchedule(s, pops) {
    var days = function (group) {
        var result = [];

        WEEK.forEach(function (i) {
            var lesson = group[i];
            if (lesson) {
                result.push(
                    pop(lesson)
                        .populate(time())
                        .populate(pops)
                        .result()
                )
            } else {
                result.push(null);
            }
        });
        return result;
    };

    var time = function () {
        return function (lesson) {
            for (var i = 0; i < lesson.time.length; i++) {
                lesson.time[i] = lesson.time[i].replace(" ", "—");
            }
            return lesson;
        }
    };

    var mondayTime = function (group) {
        var day;
        for (var i = 0; i < WEEK.length; i++) {
            if (group[WEEK[i]]) {
                day = WEEK[i];
                break;
            }
        }
        if (day) {
            return group[day].time[0].substr(0, 5);
        } else {
            return "00:00"
        }
    };

    var result = [];
    s.forEach(function (group) {
        result.push({
            name: group.name,
            days: days(group),
            time: mondayTime(group)
        });
    });
    return result;
}