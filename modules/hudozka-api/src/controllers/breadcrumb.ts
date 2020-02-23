import { getPathWaterfall } from '../lib/url'
import { Breadcrumb } from '../types'
import Page from '../core/Page'

export async function getItems(path: string): Promise<Breadcrumb> {
    const bc = getPathWaterfall(path)
    const parts = await Promise.all(bc.map(async href => {
        const resource = await Page.findByUrl(href)

        if (!resource) {
            return null
        }

        const name = resource.title

        return {
            name,
            href,
        }
    }))

    return parts.filter(Boolean)
}
