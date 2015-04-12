var fs = require("fs");
const MENU = require("./models/menu.json");

const team = require("./models/team");
const course = require("./models/course");
const document = require("./models/document");
const schedule = require("./models/schedule");

var privateFile = process.env["PRIVATE"] || "private.json";
var privateData = JSON.parse(fs.readFileSync(privateFile, "utf-8"));

var config = {
	defaultIndex: "/templates/index.html" || process.env["INDEX"],
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

	prerender: {
		prerender: "http://service.prerender.io/",
		prerenderToken: "",
		protocol: "http",
		host: "art.shlisselburg.org"
	},

	instagram:{
		default_user: "hudozka",
		tag_callback: "http://art.shlisselburg.org/instagram/callback/11",
		client_id: "",
		client_secret: "",
		redirect_uri: "http://art.shlisselburg.org/instagram/auth/callback",
		tags: ["shlb_hudozka"]
	}
};

module.exports = Object.keys(privateData)
	.reduce(function (config, key) {
		config[key] = privateData[key];
		return config;
	}, config);