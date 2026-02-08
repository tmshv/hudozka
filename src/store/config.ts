import { proxy } from "valtio"

type Contact = {
    type: string
    value: string
    title: string
}

type State = {
    contacts: Contact[]
}

export const state = proxy<State>({
    contacts: [
        {
            type: "link",
            value: "https://yandex.ru/maps/-/CKUkAXIb",
            title: "г. Шлиссельбург ул. 18 января д. 3",
        },
        {
            type: "tel",
            value: "tel:+78136276312",
            title: "+7 (81362) 76-312",
        },
        {
            type: "email",
            value: "mailto:hudozka@gmail.com",
            title: "hudozka@gmail.com",
        },
        {
            type: "link",
            value: "https://clck.ru/H83zS",
            title: "Навигатор дополнительного образования ЛО",
        },
        {
            type: "link",
            value: "https://vk.com/shlisselburghudozka",
            title: "Вконтакте",
        },
        {
            type: "link",
            value: "https://www.instagram.com/hudozka",
            title: "Инстаграм",
        },
    ],
})
