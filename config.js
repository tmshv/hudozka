const MENU = require("./models/menu.json");

const team = require("./models/team");
const course = require("./models/course");
const document = require("./models/document");
const schedule = require("./models/schedule");

module.exports = {
	port: 18010,
	pub: "./",
	data: {
		menu: MENU,
		documents: document.docs,
		team: team.team,
		courses: course.courses
	}
};
						