const DOCUMENTS = {
	"statue-2013": {
		name: "устав школы за 2013 год",
		path: "/document/statue-2013",
		preview: "/img/preview/statue-2013.png",
		url: ["http://static.shburg.org/art/docs/hudozhka_statue-2013.pdf"],
		view:"frame"
	},
	"edu-license": {
		name: "образовательная лицензия",
		path: "/document/edu-license",
		preview: "/img/preview/license_edu.png",
		url: [
			"http://static.shburg.org/art/docs/hudozhka_license_edu.jpg",
			"http://static.shburg.org/art/docs/hudozhka_license_edu_back.jpg",
			"http://static.shburg.org/art/docs/hudozhka_license_edu_attachment.jpg",
		],
		view:"page"
	},
	"gov-certificate": {
		name: "свидетельство о государственной регистрации права",
		path: "/document/gov-certificate",
		preview: "/img/preview/certificate_gov.png",
		url: ["http://static.shburg.org/art/docs/hudozhka_certificate_gov.jpg"],
		view:"page"
	},
	"VAT": {
		name: "ИНН",
		path: "/document/VAT",
		preview: "/img/preview/vatin.png",
		url: ["http://static.shburg.org/art/docs/hudozhka_vatin.jpg"],
		view:"page"
	},
	"EGRYL1": {
		name: "свидетельство о внесении в «ЕГРЮЛ»",
		path: "/document/EGRYL1",
		preview: "/img/preview/certificate_egryl1.png",
		url: ["http://static.shburg.org/art/docs/hudozhka_certificate_egryl1.jpg"],
		view:"page"
	},
	"EGRYL2": {
		name: "свидетельство о внесении в «ЕГРЮЛ»",
		path: "/document/EGRYL2",
		preview: "/img/preview/certificate_egryl2.png",
		url: ["http://static.shburg.org/art/docs/hudozhka_certificate_egryl2.jpg"],
		view:"page"
	}
};

const TEAM = [
	{
		name: "Марина Геннадьевна Тимашева",
		position: "Директор",
		edu: "Ленинградский инженерно-строительный институт",
		diplom: "НВ №222567",
		status: "",
		picture: "http://static.shburg.org/art/team/teacher5.jpg"
	},
	{
		name: "Валерий Александрович Саржин",
		position: "Преподаватель живописи",
		edu: "Академия художеств имени И. Е. Репина",
		diplom: "B-I №259798",
		status: "Первая квалификационная категория по живописи и станковой композиции",
		picture: "http://static.shburg.org/art/team/teacher10.jpg"
	},
	{
		name: "Ольга Дмитриевна Гоголева",
		position: "Преподаватель живописи",
		edu: "Ленинградский инженерно-строительный институт",
		diplom: "B-I №222572",
		status: "Высшая квалификационная категория по живописи и станковой композиции",
		picture: "http://static.shburg.org/art/team/teacher11.jpg"
	},
	{
		name: "Наталья Викторовна Андреева",
		position: "Преподаватель композиции",
		edu: "Санкт-Петербургский государственный университет технологии и дизайна",
		diplom: "ИВС 0514253",
		status: "Вторая квалификационная категория по прикладной композиции",
		picture: "http://static.shburg.org/art/team/teacher2.jpg"
	},
	{
		name: "Вера Викторовна Воронова",
		position: "Преподаватель композииции",
		edu: "Российский государственный университет имени А. И. Герцена",
		diplom: "ВСГ 0530340",
		status: "Вторая квалификационная категория по прикладной композиции",
		picture: "http://static.shburg.org/art/team/teacher1.jpg"
	},
	{
		name: "Ирина Николаевна Втюрина",
		position: "Преподаватель скульптуры",
		edu: "Кировский государственный педагогический институт имени В. И. Ленина",
		diplom: "ШВ №164501",
		status: "Первая квалификационная категория по скульптуре",
		picture: "http://static.shburg.org/art/team/teacher8.jpg"
	},
	{
		name: "Мария Юрьевна Валькова",
		position: "Преподаватель истории искусства",
		edu: "Педагогический институт имени А. И. Герцена",
		diplom: "ПП №224197",
		status: "Высшая квалификационная категория по истории искусства",
		picture: "http://static.shburg.org/art/team/teacher.jpg"
	},
	{
		name: "Руслан Камилевич Тимашев",
		position: "Преподаватель компьютерной графики",
		edu: "Санкт-Петербургский государственный архитектурно-строительный университет",
		diplom: "ВСГ 5344910",
		status: "",
		picture: "http://static.shburg.org/art/team/teacher4.jpg"
	},
	{
		name: "Анна Сергеевна Манцева",
		position: "Преподаватель рисунка",
		edu: "Московский архитектурный институт",
		diplom: "РН 70241",
		status: "",
		picture: "http://static.shburg.org/art/team/teacher3.jpg"
	},
	{
		name: "Серафима Александровна Латыпова",
		position: "Преподаватель рисунка",
		edu: "Незаконченный Ленинградский государственный педагогический университет имени А. С. Пушкина",
		diplom: "",
		status: "",
		picture: "http://static.shburg.org/art/team/teacher9.jpg"
	},
	{
		name: "Евгения Юрьевна Тарасова",
		position: "Преподаватель гравюры",
		edu: "Санкт-Петербургский государственный архитектурно-строительный университет",
		diplom: "ВСВ 1321444",
		status: "",
		picture: "http://static.shburg.org/art/team/teacher.jpg"
	},
];

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
				text:"Занятия",
				// url:"/schedule",
				class:"selected"
			},
			{
				text:"Коллектив",
				url:"/team",
				class:"selected pink"
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
exports.team = function(processor) {
	var list = [];
	TEAM.forEach(function(m){
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