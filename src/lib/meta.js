export function meta(props) {
    const path = props.url || '/'
    const url = `https://art.shlisselburg.org${path}`

    return {
        title: 'Шлиссельбургская ДХШ',
        description: 'Сайт Шлиссельбургской художественной школы',
        image: 'https://art.shlisselburg.org/entrance.jpg',
        imageWidth: 1200,
        imageHeight: 630,

        siteName: 'Шлиссельбургская Детская Художественная Школа',
        locale: 'ru_RU',
        type: 'website',
        domain: 'art.shlisselburg.org',
        twitterCard: 'summary_large_image',
        twitterSite: '@',
        twitterCreator: '@tmshv',

        ...props,
        url,
    }
}
