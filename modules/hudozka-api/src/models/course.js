const courses = {
	painting: ['Живопись', ''],
	drawing: ['Рисунок', '/courses/drawing'],
	sculpting: ['Скульптура', ''],
	sculpture: ['Скульптура', ''],
	ceramic: ['Керамика', '/courses/ceramics'],
	ceramics: ['Керамика', '/courses/ceramics'],
	composition: ['Композиция', ''],
	'easel-composition': ['Станковая композиция', ''],
	dpi: ['ДПИ', ''],
	'art-talks': ['Беседа по искусству', ''],
	history: ['История искусства', '/courses/art-history'],
	cg: ['Комп. графика', '/courses/cg'],
}

export function getCourse(id) {
	const course = id in courses ? courses[id] : null
	if (!course) return null

	const [title, url] = course
	return {id, title, url}
}
