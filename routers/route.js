const config = require("../config")

function getMenu(){
	return clone(config.data.menu);
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