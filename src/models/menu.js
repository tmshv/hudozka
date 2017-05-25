export default [
	{
		url: '/',
		text: 'Школа',
		color: 'blue',
		items: [
			{url: '/summer-school/2017', text: 'Летние каникулы 2017'},
			{url: '/articles/*', text: 'Статьи'},
			{url: '/article/*', text: ''},
		],
	},
	{
		'text': 'Расписание',
		'url': '/schedule',
		'color': 'green'
	},
	{
		'text': 'Поступление',
		'url': '/join',
		'color': 'yellow'
	},
	{
		url: '/courses/',
		text: 'Предметы',
		color: 'magenta',
		items: [
			{url: 'ceramics', text: 'Керамика'},
			{url: 'batik', text: 'Живопись'},
			{url: 'easel-composition', text: 'Живопись'},
			{url: 'cg', text: 'Живопись'},
			{url: 'scale-modeling', text: 'Живопись'},
			{url: 'drawing', text: 'Живопись'},
			{url: 'costume-composition', text: 'Живопись'},
			{url: 'felting', text: 'Живопись'},
			{url: 'art-history', text: 'Живопись'},

			{url: 'perishki', text: 'Живопись'},
			{url: 'matreshki', text: 'Живопись'},
			{url: 'listochki', text: 'Живопись'},
		]
	},
	{
		text: 'Коллектив',
		url: '/collective',
		color: 'pink',
		items: [
			{url: '/teacher/*', text: ''},
		]
	},
	{
		text: 'Галерея',
		url: '/gallery',
		color: 'red',
		items: [
			{url: '/album/*', text: ''},
		]
	},
	{
		'text': 'Документы',
		'url': '/documents',
		'color': 'yellow'
	},
	{
		url: '/info/',
		text: 'Сведения об образовательной организации',
		color: 'orange',
		items: [
			{url: 'main', text: 'Основные сведения'},
			{url: 'structure', text: 'Структура и органы управления образовательной организацией'},
			{url: 'education', text: 'Образование'},
			{url: 'standards', text: 'Образовательные стандарты'},
			//{url: '/collective', text: 'Руководство. Педагогический (научно-педагогический) состав'},
			{url: 'support', text: 'Материально-техническое обеспечение образовательного процесса'},
			{url: 'grants', text: 'Стипендии и иные виды материальной поддержки'},
			{url: 'paid-services', text: 'Платные образовательные услуги'},
			{url: 'finances', text: 'Финансово-хозяйственная деятельность'},
			{url: 'vacancy', text: 'Вакантные места для приема'},

			{url: 'tools', text: 'Список рекомендованных материалов'},
			{url: 'history', text: 'История школы'},

			{url: '*', text: ''},
		]
	},
	{
		'text': 'Текущий контроль',
		'url': '/info/audit',
		'color': 'gray'
	}
]
