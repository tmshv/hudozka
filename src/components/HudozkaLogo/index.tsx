import s from "./logo.module.css"

import Image from "next/image"
import src from "src/assets/hudozka-logo.png"

function HudozkaLogo() {
    return (
        <div className={s.container}>
            <Image
                src={src}
                width={36}
                height={36}
                alt={"Hudozka"}
            />
        </div>
    )
}

export default HudozkaLogo
