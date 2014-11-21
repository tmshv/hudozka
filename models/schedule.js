var pop = require("../utils/populate").pop;

const WEEK = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const SCHEDULES = {
	"2014-early": require("./schedule-2014-early.json"),
	"2014-late": require("./schedule-2014-late.json")
};

module.exports = function (year, name, pops) {
	//var s = require(
	//	[year, name].reduce(function (r, v, i) {
	//		var n = "{i}".replace("i", i);
	//		return r.replace(n, v);
	//	}, "./schedule-{0}-{1}.json")
	//);

	var s = SCHEDULES[year + "-" + name];
	return populateSchedule(s, pops);
};

function populateSchedule(s, pops){
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