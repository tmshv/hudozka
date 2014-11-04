var Router = require("express").Router;
var route = require("./route");
var document = require("../models/document");

var router = new Router();
module.exports = router.middleware;

router.get("/docs", function(req, res){
	var url = "/docs";

	res.render("docs/docs", {
		menu: route.menu(url),
		blocks: [
			{
				type: "documents",
				name: "Лицензии, свидетельства и уставы",
				items: document.cap(
					document.doc(
						["statue-2013", "edu-license", "gov-certificate", "VAT", "EGRYL1", "EGRYL2"]
					)
				)
			}
		]
	});
});

router.get("/document/:doc/:page?", function(req, res){
	var name = req.param("doc");
	var doc = document.doc(name);
	// doc = document.extra(doc, {
	// 	"style": [
	// 		"/s/pdf.css"
	// 	],
	// 	"script": [
	// 		"http://code.jquery.com/jquery-2.1.0.min.js",
	// 		"/c/document.js"
	// 	]
	// });

	if(doc){
		doc.startPage = req.param("page");
		res.render("document/document", {doc: doc});
	}else{
		res.error(404);
	}
});