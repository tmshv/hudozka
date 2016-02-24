//getPersonByID
export function person(collective, id){
	for(var i=0; i<collective.length; i++){
		var p = collective[i];
		if(p.id == id){
			return p;
		}
	}
	return null;
}

//getNameByID
export function name(collective, id){
	var p = person(collective, id);
	if(p) return p.name;
	else return null;
}

//getShortNameByID
export function short(collective, id){
	var n = name(collective, id);
	if(n) return shortifyName(n);
	else return null;
}

export function shortifyName(name){
	var m = splitName(name);
	var n = m[1].replace(/^(.).+/, "$1. ") +
			m[2].replace(/^(.).+/, "$1. ") +
			m[3];
	return n;
}

export function splitName(name){
	return /(.+)\s(.+)\s(.+)/.exec(name);
}