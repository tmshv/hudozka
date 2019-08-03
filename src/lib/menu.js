const url = require('url')
const getPathWithNoTrailingSlash = require('../lib/url').getPathWithNoTrailingSlash
const urlToPattern = require('../lib/url').urlToPattern
const isMatchPathPattern = require('../lib/url').isMatchPathPattern
const isEqualPate = require('../lib/url').isEqualPath
const { compose, any } = require('../lib/common')

function isActive(path, menuItem) {
    return isEqualPate(path, menuItem.url, true)
}

function isHighlighted(path, menuItem) {
    return any(flatMenuItem(menuItem)
        .map(i => isMatchPathPattern(
            compose(urlToPattern, getPathWithNoTrailingSlash)(i.url),
            path,
            true
        ))
    )
}

function flatMenuItem(item) {
    const rootUrl = item.url
    const flatUrls = items => {
        return items.map(item => ({
            ...item,
            url: url.resolve(rootUrl, item.url)
        }))
    }

    return !item.items
        ? [item]
        : item.items.reduce((acc, i) => [...acc, ...compose(flatUrls, flatMenuItem)(i)], [item])
}

/**
 * Takes plain menu model and sample path and defines is an item of menu should be active
 *
 * @param path
 * @param menu
 * @return {{items}}
 */
export function buildMenu(path, menu) {
    const items = menu.map(item => ({
        ...item,
        active: isActive(path, item),
        highlighted: isHighlighted(path, item),
    }))
    return { items }
}
