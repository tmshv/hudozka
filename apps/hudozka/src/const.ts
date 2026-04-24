import type { MenuItem } from "./types"

export const yearRange = [2012, 2026].join("—")
export const siteUrl = "https://art.shlisselburg.org"

export const menu: MenuItem[] = [
    {
        name: "Школа",
        href: "/",
    },
    {
        name: "Коллектив",
        href: "/collective",
    },
    {
        name: "Документы",
        href: "/documents",
    },
    {
        name: "Сведения об образовательной организации",
        href: "/info",
    },
]

type Contact = {
    type: string
    value: string
    title: string
}

export const contacts: Contact[] = [
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
]
