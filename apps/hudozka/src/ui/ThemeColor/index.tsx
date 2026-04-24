import { useDarkTheme } from "@/hooks/useDarkTheme"

export type ThemeColorProps = {
    color: string
    darkColor: string
}

export const ThemeColor: React.FC<ThemeColorProps> = ({ color, darkColor }) => {
    const dark = useDarkTheme()

    return (
        <meta
            name="theme-color"
            content={dark ? darkColor : color}
        />
    )
}
