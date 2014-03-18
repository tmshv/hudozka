const MENU = require("./models/menu.json");
const DOCUMENTS = require("./models/documents.json");
const SCHEDULE = require("./models/schedule-2014-early.json");

const team = require("./models/team");
const course = require("./models/course");

module.exports = {
	port: 18010,
	pub: "./",
	data:{
		menu: MENU,
		documents: DOCUMENTS,
		team: team.team,
		courses: course.courses,
		schedule: schedule(SCHEDULE),
	}
}

function schedule(_schedule){
	var days = function(group){
		var result = [];
		var list = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
		list.forEach(function(i){
			var lesson = group[i];
			if(lesson){
				result.push(
					lol(lesson)
						.fun(time())
						.fun(populate(team.short, "teacher"))
						.fun(populate(course.name, "lesson"))
						.data()
				)
			}else{
				result.push(null);
			}
		});
		return result;
	}

	var time = function(){
		return function(lesson){
			for(var i=0; i <  lesson.time.length; i++){
				lesson.time[i] = lesson.time[i].replace(" ", "—");
			}
			return lesson;
		}
	}

	var result = [];
	_schedule.forEach(function(group){
		result.push({
			name: group.name,
			days: days(group)
		});
	});
	return result;
}

function lol(data){
	var Fun = function(data){
		this._data = data;
	}
	Fun.prototype = {
		fun: function(fun){
			if(typeof fun == "function"){
				this._data = fun(this._data);
			}
			return this;
		},
		data: function(){
			return this._data;
		}
	};

	var fun = new Fun(data);
	return fun;
}

function populate(find, field){
	return function(lesson){
		var id = lesson[field];
		var val = find(id);
		if(val) lesson[field] = val;
		return lesson;
	}
}