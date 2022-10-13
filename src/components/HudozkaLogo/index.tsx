import s from "./logo.module.css"

import Image from "next/future/image"
import image from "src/assets/hudozka-logo.png"

export type HudozkaLogoProps = {
    dark?: boolean
}

export const HudozkaLogo: React.FC<HudozkaLogoProps> = ({ dark }) => (
    <div className={`${s.container} ${dark ? s.dark : ""}`}>
        <Image
            src={image}
            width={36}
            height={36}
            alt={"Hudozka"}
        />
    </div>
)
