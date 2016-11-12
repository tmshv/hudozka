import {stringReplace} from '../utils/string';

const nbsp = 0xA0;

export const mobileMatchSelector = '(max-device-width: 30em)';

export const contacts = {
	telephone: '+7 (81362) 76-312',
	email: 'hudozka@gmail.com',
	address: ['г. Шлиссельбург', 'ул. 18 января', 'д. 3']
		.map(stringReplace(' ', String.fromCharCode(nbsp)))
		.join(' ')
};

export const collectiveSortPattern = [
	'mg-timasheva',
	'va-sarzhin',
	'od-gogoleva',
	'my-valkova',
	'vv-voronova',
	'nv-andreeva'
];

export const documentsSortPattern = [
	'Основные документы',
	'Документы для поступления',
	'Учебные программы',
	'Прочее',
	'Архив'
];

export const footer = {
	links: {
		docs: {
			title: 'Документы',
			links: [
				{url: '/document/edu-license', link: 'Лицензия на осуществление образовательной деятельности'},
				{url: '/document/gov-certificate', link: 'Свидетельство о государственной регистрации права'},
				{url: '/document/EGRYL1', link: 'Свидетельство о внесении в «ЕГРЮЛ»'},
				{url: '/document/VAT', link: 'ИНН'},
				{url: '/document/statue-2013', link: 'Устав школы'}
			]
		}
	}
};
