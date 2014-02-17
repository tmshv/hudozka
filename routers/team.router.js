var Router = require("express").Router;
var route = require("./route");

// var router = Object.create(Router);
var router = new Router();
router.get("/team", function(req, res){
	var url = "/team";

	res.render("team/team", {
		menu: route.menu(url),
		team: route.team(route.nameProcessor())
	});
});

router.get("/teachers/:name", function(req, res){
	var name = req.param("name");
	res.error(404);
});

module.exports = router;