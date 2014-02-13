const DOCUMENTS = {
	"statue-2013": {
		name: "устав школы за 2013 год",
		path: "/document/statue-2013",
		preview: "/img/preview/statue-2013.png",
		url: ["/files/hudozhka_statue-2013.pdf"],
		view:"frame"
	},
	"edu-license": {
		name: "образовательная лицензия",
		path: "/document/edu-license",
		preview: "/img/preview/license_edu.png",
		url: [
			"/files/hudozhka_license_edu.jpg",
			"/files/hudozhka_license_edu_back.jpg",
			"/files/hudozhka_license_edu_attachment.jpg",
		],
		view:"page"
	},
	"gov-certificate": {
		name: "свидетельство о государственной регистрации права",
		path: "/document/gov-certificate",
		preview: "/img/preview/certificate_gov.png",
		url: ["/files/hudozhka_certificate_gov.jpg"],
		view:"page"
	},
	"VAT": {
		name: "ИНН",
		path: "/document/VAT",
		preview: "/img/preview/vatin.png",
		url: ["/files/hudozhka_vatin.jpg"],
		view:"page"
	},
	"EGRYL1": {
		name: "свидетельство о внесении в «ЕГРЮЛ»",
		path: "/document/EGRYL1",
		preview: "/img/preview/certificate_egryl1.png",
		url: ["/files/hudozhka_certificate_egryl1.jpg"],
		view:"page"
	},
	"EGRYL2": {
		name: "свидетельство о внесении в «ЕГРЮЛ»",
		path: "/document/EGRYL2",
		preview: "/img/preview/certificate_egryl2.png",
		url: ["/files/hudozhka_certificate_egryl2.jpg"],
		view:"page"
	}
};

function getMenu(){
	var menu = {
		items:[
			{
				text:"Школа",
				url:"/",
				class:"selected blue"
			},
			{
				text:"Расписание",
				// url:"/schedule",
				class:"selected green"
			},
			{
				text:"Преподаватели",
				// url:"/teachers",
				class:"selected"
			},
			{
				text:"Выпускники",
				// url:"/graduates",
				class:"selected"
			},
			{
				text:"Галерея",
				// url:"/gallery",
				class:"selected"
			},
			{
				text:"Документы",
				url:"/docs",
				class:"selected yellow"
			},
		],
		vkgroup:"https://vk.com/club10436104"
	};
	return menu;
}

function getDoc(name, capitalFirstLetter){
	if(name && typeof name == "string"){
		var doc = DOCUMENTS[name];
		if(capitalFirstLetter) return makeCap(clone(doc));
		else return clone(doc);
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