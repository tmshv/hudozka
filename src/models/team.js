const TEAM = require("./team.json");

module.exports = {
	team: TEAM,
	person: getPersonByID,
	name: getNameByID,
	short: getShortNameByID,
	splitName: splitName
};

function getPersonByID(id){
	for(var i=0; i<TEAM.length; i++){
		var p = TEAM[i];
		if(p.id == id){
			return p;
		}
	}
	return null;
}

function getNameByID(id){
	var p = getPersonByID(id);
	if(p) return p.name;
	else return null;
}

function getShortNameByID(id){
	var n = getNameByID(id);
	if(n) return shortifyName(n)
	else return null;
}

function shortifyName(name){
	var m = splitName(name);
	var n = m[1].replace(/^(.).+/, "$1. ") +
			m[2].replace(/^(.).+/, "$1. ") +
			m[3];
	return n;
}

function splitName(name){
	return /(.+)\s(.+)\s(.+)/.exec(name);
}