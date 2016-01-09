const DOCS = require("./documents.json");

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