var express = require("express");
var consolidate = require("consolidate");
var path = require("path");
var config = require("./config");

var pub = "./public";
// var pub = path.resolve("~/Dropbox/Dev/Hud school/public/");
// console.log(pub);
// console.log(pub);

var server = express();
server.engine("jade", consolidate.jade);
server.set("view engine", "jade");
server.set("views", [__dirname, "/pages"].join(""));
server.use(express.static(pub));

server.get("/", function(req, res){
	var url = "/";
	var route = require("./routers/route");
	res.render("main/main", {
		menu: route.menu(url)
	});
});

server.use(require("./routers/schedule"));
server.use(require("./routers/team.router").middleware);
server.use(require("./routers/docs"));

server.listen(config.port);
console.log("welcome!");
// console.log(JSON.stringify(config.data.schedule, null, "\t"));