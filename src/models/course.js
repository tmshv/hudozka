export const courses = {
	painting: "Живопись",
	drawing: "Рисунок",
	sculpting: "Скульптура",
	ceramic: "Керамика",
	composition: "Композиция",
	history: "История искусства",
	cg: "Комп. графика"
};

export function getCourseByID(id){
	for(var i=0; i<courses.length; i++){
		var p = courses[i];
		if(p.id == id){
			return p;
		}
	}
	return null;
}

export function getCourseNameByID(id){
	var p = getCourseByID(id);
	if(p) return p.name;
	else return null;
}