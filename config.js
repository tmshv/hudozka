const MENU = require("./models/menu.json");

const team = require("./models/team");
const course = require("./models/course");
const document = require("./models/document");
const schedule = require("./models/schedule");

module.exports = {
	port: process.env["PORT"] || 3000,
	pub: "./",
	data: {
		menu: MENU,
		documents: document.docs,
		team: team.team,
		courses: course.courses
	},

	db: {
		uri: "mongodb://localhost:27017/hudozka"
	},

	instagram:{
		client_id: "f17901a26a5e4a5ca4544dd0eebe2a15",
		client_secret: "ecce08509871427ab9f8f383318315fc",
		redirect_uri: "http://home.tmshv.ru:1337/auth/instagram/callback"
	},

	tags: ["shlb_hudozka"]
};
						