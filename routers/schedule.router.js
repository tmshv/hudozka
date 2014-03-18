var Router = require("express").Router;
var config = require("../config");
var route = require("./route");

var router = new Router();
router.get("/schedule", function(req, res){
	var url = "/schedule";

	res.render("schedule/schedule", {
		menu: route.menu(url),
		groups: config.data.schedule
	});
});

module.exports = router;