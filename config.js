var fs = require("fs");
const MENU = require("./models/menu.json");

const team = require("./models/team");
const course = require("./models/course");
const document = require("./models/document");
const schedule = require("./models/schedule");

var privateFile = process.env["PRIVATE"] || "private.json";
var privateData = JSON.parse(fs.readFileSync(privateFile, "utf-8"));

var config = {
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

	tag: "shlb_hudozka"
};

module.exports = Object.keys(privateData)
	.reduce(function (config, key) {
		config[key] = privateData[key];
		return config;
	}, config);