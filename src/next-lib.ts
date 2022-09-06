import { NextPageContext } from "next"

export interface IResponseItems<T> {
    items: T[]
    nextPage: number
    prevPage: number
}

/**
 * This wrapper prevents fetching api request in static export mode and production environment
 * because nextjs call getInitialProps on the client side
 *
 * @param {*} fn
 */
export function wrapInitialProps(fn: (ctx: NextPageContext) => void) {
    return async (ctx: NextPageContext) => {
        if (process.env.NODE_ENV === "production" && process.browser) {
            return window["__NEXT_DATA__"].props.pageProps
        }

        return fn(ctx)
    }
}

export type FactoryFunction<I, O> =
    | ((response: I) => O)
    | ((response: I) => Promise<O>)
export type ApiDefaultResponse<O> = () => O

export function apiGet<I, O>(factory: FactoryFunction<I, O>) {
    return async (url: string, getDefaultResponse: ApiDefaultResponse<O>) => {
        const res = await fetch(url)
        if (res.ok) {
            const data = await res.json() as I
            return factory(data)
        }

        return getDefaultResponse()
    }
}
