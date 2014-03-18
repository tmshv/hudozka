const config = require("../config")
const DOCUMENTS = config.data.documents;

function getMenu(){
	return clone(config.data.menu);
}

function getDoc(name, capitalFirstLetter){
	if(name && typeof name == "string"){
		for(var i=0; i<DOCUMENTS.length; i++){
			var doc = DOCUMENTS[i];
			if(doc.name == name){
				if(capitalFirstLetter) return makeCap(clone(doc));
				else return clone(doc);
			}	
		}
		return null;
	}else if(name && name instanceof Array){
		var docs = [];
		name.forEach(function(i){
			var d = getDoc(i, capitalFirstLetter);
			if(d){
				docs.push(d);
			}
		});
		return docs;
	}else{
		return null;
	}
}

function makeCap(doc){
	var n = doc.name;
	// doc.name = n.substr(0, 1).toUpperCase() + n.substr(1);
	doc.name = n.charAt(0).toUpperCase() + n.substring(1);
	return doc;
}

function clone(obj){
    if(obj == null || typeof(obj) != 'object')
        return obj;

    var temp = obj.constructor(); // changed

    for(var key in obj)
        temp[key] = clone(obj[key]);
    return temp;
}

exports.menu = function(url){
	var m = getMenu();
	m.items.forEach(function(i){
		if(i.url != url) i.class = "";
	});
	return m;
}

exports.doc = getDoc;
exports.team = function(processor) {
	var list = [];
	config.data.team.forEach(function(m){
		if(processor){
			processor(m);
		}
		list.push(m);
	});
	return list;
}

exports.nameProcessor = function(delimiter){
	if(!delimiter) delimiter = /\s+/;
	return function(member){
		var nnn = member.name.split(delimiter);
		member.firstName = nnn[0];
		member.middleName = nnn[1];
		member.lastName = nnn[2];		
	}
}