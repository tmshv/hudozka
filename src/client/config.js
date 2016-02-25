import {stringReplace} from '../utils/string';

const nbsp = 0xA0;

export let contacts = {
    telephone: '+7 (81362) 76-312',
    email: 'hudozka@gmail.com',
    address: ['г. Шлиссельбург', 'ул. 18 января', 'д. 3']
        .map(stringReplace(' ', String.fromCharCode(nbsp)))
        .join(' ')
};

export let collectiveSortPattern = [
    'mg-timasheva',
    'va-sarzhin',
    'od-gogoleva',
    'my-valkova',
    'vv-voronova',
    'nv-andreeva'
];

export let routes = [
    {
        name: '/',
        template: '<page-school></page-school>',
        title: 'ДХШ Шлиссельбурга'
    },
    {
        name: '/schedule/:period?/:semester?',
        template: '<page-schedule></page-schedule>',
        title: 'Расписание'
    },
    {
        name: '/collective',
        template: '<page-collective></page-collective>',
        title: 'Преподаватели'
    },
    {
        name: '/gallery',
        template: '<page-gallery></page-gallery>',
        title: 'Работы учащихся'
    },
    {
        name: '/gallery/:year/:course/:album',
        template: '<page-gallery-album></page-gallery-album>'
    },
    {
        name: '/documents',
        templateUrl: '/views/documents.html',
        controller: 'DocumentsPageController',
        title: 'Документы'
    }
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
        },
        sites: {
            title: 'Ссылки на образовательные сайты',
            links: [
                {
                    url: 'http://минобрнауки.рф',
                    link: 'минобрнауки.рф',
                    description: 'Министерство образования и науки Российской Федерации'
                },
                {url: 'http://edu.ru', link: 'edu.ru', description: 'Федеральный сайт «Российское образование»'},
                {
                    url: 'http://window.edu.ru',
                    link: 'window.edu.ru',
                    description: 'Единое окно доступа к образовательным ресурсам'
                },
                {
                    url: 'http://school-collection.edu.ru',
                    link: 'school-collection.edu.ru',
                    description: 'Единая коллекция цифровых образовательных ресурсов'
                },
                {
                    url: 'http://fcior.edu.ru',
                    link: 'fcior.edu.ru',
                    description: 'Федеральный центр информационных образовательных ресурсов'
                },
                {url: 'http://dkhshmga.ru', link: 'dkhshmga.ru', description: 'Художественная школа Мги'},
                {
                    url: 'http://kirovskdmh.ucoz.ru',
                    link: 'kirovskdmh.ucoz.ru',
                    description: 'Музыкальная школа Кировска'
                }
            ]
        }
    }
};

