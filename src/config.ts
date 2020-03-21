const currentYear = () => (new Date()).getFullYear()

export default {
    yearStart: 2012,
    yearEnd: currentYear(),
    contacts: [
        {
            type: 'link',
            value: 'https://yandex.ru/maps/-/CKUkAXIb',
            title: 'г. Шлиссельбург ул. 18 января д. 3',
        },
        {
            type: 'tel',
            value: 'tel:+78136276312',
            title: '+7 (81362) 76-312',
        },
        {
            type: 'email',
            value: 'mailto:hudozka@gmail.com',
            title: 'hudozka@gmail.com',
        },
        {
            type: 'link',
            value: 'https://clck.ru/H83zS',
            title: 'Навигатор дополнительного образования ЛО',
        },
        {
            type: 'link',
            value: 'https://vk.com/shlisselburghudozka',
            title: 'Вконтакте'
        },
        {
            type: 'link',
            value: 'https://www.instagram.com/hudozka',
            title: 'Инстаграм'
        }
    ],
    menu: [
        {
            name: 'Школа',
            href: '/',
        },
        {
            name: 'Поступление',
            href: '/join',
        },
        {
            name: 'Предметы',
            href: '/courses',
        },
        {
            name: 'Коллектив',
            href: '/collective',
        },
        {
            name: '«Мы соседи»',
            href: '/neighbors',
        },
        {
            name: 'Документы',
            href: '/documents',
        },
        {
            name: 'Сведения об образовательной организации',
            href: '/info',
        },
    ]
}
