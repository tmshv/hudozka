const DOCS = [
	{
		"name": "statue-2013",
		"title": "устав школы за 2013 год",
		"url": "https://static.shburg.org/art/docs/hudozhka_statue-2013.pdf",
		"preview": "https://static.shburg.org/art/graphics/statue-2013-preview.png",
		"files": ["https://static.shburg.org/art/docs/hudozhka_statue-2013.pdf"]
	},
	{
		"name": "edu-license",
		"title": "образовательная лицензия",
		"url": "/document/edu-license",
		"preview": "https://static.shburg.org/art/graphics/license_edu-preview.png",
		"files": [
			"https://static.shburg.org/art/docs/hudozhka_license_edu.jpg",
			"https://static.shburg.org/art/docs/hudozhka_license_edu_back.jpg",
			"https://static.shburg.org/art/docs/hudozhka_license_edu_attachment.jpg"
		]
	},
	{
		"name": "gov-certificate",
		"title": "свидетельство о государственной регистрации права",
		"url": "/document/gov-certificate",
		"preview": "https://static.shburg.org/art/graphics/certificate_gov-preview.png",
		"files": ["https://static.shburg.org/art/docs/hudozhka_certificate_gov.jpg"]
	},
	{
		"name": "VAT",
		"title": "ИНН",
		"url": "/document/VAT",
		"preview": "https://static.shburg.org/art/graphics/vatin-preview.png",
		"files": ["https://static.shburg.org/art/docs/hudozhka_vatin.jpg"]
	},
	{
		"name": "EGRYL1",
		"title": "свидетельство о внесении в «ЕГРЮЛ»",
		"url": "/document/EGRYL1",
		"preview": "https://static.shburg.org/art/graphics/certificate_egryl1-preview.png",
		"files": ["https://static.shburg.org/art/docs/hudozhka_certificate_egryl1.jpg"]
	},
	{
		"name": "EGRYL2",
		"title": "свидетельство о внесении в «ЕГРЮЛ»",
		"url": "/document/EGRYL2",
		"preview": "https://static.shburg.org/art/graphics/certificate_egryl2-preview.png",
		"files": ["https://static.shburg.org/art/docs/hudozhka_certificate_egryl2.jpg"]
	}
];

exports.docs = DOCS;
exports.doc = getDocByName;
exports.cap = makeCap;
// exports.extra = populateExtra;

function getDocByName(name){
	if(name && typeof name == "string"){
		for(var i=0; i<DOCS.length; i++){
			var doc = DOCS[i];
			if(doc.name == name){
				return clone(doc);
			}	
		}
		return null;
	}else if(name && name instanceof Array){
		var docs = [];
		name.forEach(function(i){
			var d = getDocByName(i);
			if(d){
				docs.push(d);
			}
		});
		return docs;
	}else{
		return null;
	}
}

function clone(obj){
    if(obj == null || typeof(obj) != 'object')
        return obj;

    var temp = obj.constructor(); // changed

    for(var key in obj)
        temp[key] = clone(obj[key]);
    return temp;
}

/**
 * Capitalize first letter of document name
 * Process doc object or array of objects
 * @param  {Object | Array} doc document object or array of document objects
 * @return {[type]} document object or array of document objects with capitalized first letter of document name
 */
function makeCap(doc){
	if(doc instanceof Array){
		for(var i=0; i<doc.length; i++){
			doc[i] = makeCap(doc[i]);
		}
	}else{
		var n = doc.name;
		doc.name = n.charAt(0).toUpperCase() + n.substring(1);		
	}

	return doc;
}

// function populateExtra(doc, extra){
// 	if(!doc.extra) doc.extra = {};
// 	for(var i in extra){
// 		if(!doc.extra[i]) doc.extra[i] = [];
// 		doc.extra[i] = doc.extra[i].concat(extra[i]);
// 	}
// 	return doc;
// }