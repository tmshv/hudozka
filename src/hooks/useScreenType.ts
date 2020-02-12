import * as React from 'react'
import useMedia from 'use-media'

export type Type = 'phone' | 'tablet' | 'laptop' | 'desktop'

export function useScreenType(types: Type[]): boolean {
    const isPhone = useMedia('(max-width: 31.25em)')
    const [match, setMatch] = React.useState(false)

    React.useEffect(() => {
        setMatch(isPhone && types.includes('phone'))
    }, [isPhone])

    return match
}
