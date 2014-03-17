module.exports = {
	port: 18010,
	pub: "./",
	data:{
		documents: require("./models/documents.json"),
		schedule: require("./models/schedule-2014-early.json"),
		team: require("./models/team.json"),
		menu: require("./models/menu.json"),
	}
}