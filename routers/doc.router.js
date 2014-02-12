var Router = require("express").Router;
var route = require("./route");

// var router = Object.create(Router);
var router = new Router();
router.get("/docs", function(req, res){
	var url = "/docs";

	res.render("docs/docs", {
		menu: route.menu(url),
		blocks: [
			{
				type: "documents",
				name: "Лицензии, свидетельства и уставы",
				items: route.doc(["statue-2013", "edu-license", "gov-certificate", "VAT", "EGRYL1", "EGRYL2"], true)
			}
		]
	});
});

router.get("/document/:doc", function(req, res){
	var name = req.param("doc");

	var doc = route.doc(name);
	if(doc){
		// doc.name = renderDocName(doc.name);

		res.render(viewMode(doc), {doc: doc});

		// res.render("document/document", {doc:doc});
	}else{
		res.error(404);
	}
});

module.exports = router;


function renderDocName(name){
	//render markdown
	return "ДХШ Шлиссельбурга, " + name;
}

function viewMode(doc){
	var o = {
		"frame": "document/display",
		"page": "document/document",
	};
	return o[doc.view];
}