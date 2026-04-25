import { DesktopNavigation } from "./DesktopNavigation"
import { MobileNavigation } from "./MobileNavigation"
import s from "./nav.module.css"

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
