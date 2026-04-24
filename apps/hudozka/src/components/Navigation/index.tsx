import s from "./nav.module.css"
import { DesktopNavigation } from "./DesktopNavigation"
import { MobileNavigation } from "./MobileNavigation"

export type NavigationProps = {
    style?: React.CSSProperties
}

export function Navigation({ style }: NavigationProps) {
    return (
        <>
            <div className={s.desktop}>
                <DesktopNavigation style={style} />
            </div>
            <div className={s.mobile}>
                <MobileNavigation style={style} />
            </div>
        </>
    )
}
