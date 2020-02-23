import useMedia from 'use-media'

export function useMobile(): boolean {
    return useMedia('(max-width: 31.25em)', false)
}
