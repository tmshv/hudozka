const COURSES = require("./courses.json");

exports.courses = COURSES;
exports.course = getCourseByID;
exports.name = getCourseNameByID;

function getCourseByID(id){
	for(var i=0; i<COURSES.length; i++){
		var p = COURSES[i];
		if(p.id == id){
			return p;
		}
	}
	return null;
}

function getCourseNameByID(id){
	var p = getCourseByID(id);
	if(p) return p.name;
	else return null;
}