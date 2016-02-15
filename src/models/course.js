export const courses = [
	{
		"id": "painting",
		"name": "Живопись"
	},
	{
		"id": "drawing",
		"name": "Рисунок"
	},
	{
		"id": "sculpting",
		"name": "Скульптура"
	},
	{
		"id": "ceramic",
		"name": "Керамика"
	},
	{
		"id": "composition",
		"name": "Композиция"
	},
	{
		"id": "history",
		"name": "История искусства"
	},
	{
		"id": "cg",
		"name": "Комп. графика"
	}
];

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