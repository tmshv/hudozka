import axios from 'axios'
import { NextPageContext } from 'next'

export interface IResponseItems<T> {
    items: T[]
    nextPage: number
    prevPage: number
}

export async function requestGet<T>(url: string, defaultResponse: T): Promise<T> {
    try {
        const res = await axios.get<T>(url)

        return res.data
    } catch (e) {
        return defaultResponse
    }
}

/**
 * This wrapper prevents fetching api request in static export mode and production environment
 * because nextjs call getInitialProps on the client side
 * 
 * @param {*} fn 
 */
export function wrapInitialProps(fn: (ctx: NextPageContext) => void) {
    return async (ctx: NextPageContext) => {
        if (process.env.NODE_ENV === 'production' && process.browser) {
            return window['__NEXT_DATA__'].props.pageProps;
        }

        return fn(ctx)
    }
}

export function createApiUrl(path: string) {
    return `https://api.tmshv.com/hudozka${path}`
}

export function apiGet<I, O>(factory: (response: I) => O) {
    return async (url: string, defaultResponse: O) => {
        const res = await requestGet<I>(url, null)
        if (!res) {
            return defaultResponse
        }

        return factory(res)
    }
}
