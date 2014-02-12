var express = require("express");
var consolidate = require("consolidate");
var path = require("path");

var pub = path.resolve("~/Dropbox/Dev/Hud school/public/");
console.log(pub);

var server = express();
server.engine("jade", consolidate.jade);
server.set("view engine", "jade");
server.set("views", [__dirname, "/pages"].join(""));
server.use(express.static(pub));
// server.use(express.static([__dirname, "/public"].join("")));

server.get("/", function(req, res){
	var url = "/";
	var route = require("./routers/route");
	res.render("main/main", {
		menu: route.menu(url)
	});
});

server.use(require("./routers/doc.router").middleware);

server.listen(8080);
console.log("welcome!");