export const courses = {
	painting: "Живопись",
	drawing: "Рисунок",
	sculpting: "Скульптура",
    sculpture: "Скульптура",
	ceramic: "Керамика",
    ceramics: "Керамика",
	composition: "Композиция",
	history: "История искусства",
	cg: "Комп. графика"
};

export function getCourseName(id) {
    const course = Object
        .entries(courses)
        .find(([key]) => key === id);
    return course ? course[1] : null;
}
