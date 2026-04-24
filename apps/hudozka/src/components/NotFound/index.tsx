import Image from "next/image"

import Link from "next/link"
import skull from "@/assets/graphics/skull.jpg"
import s from "./error.module.css"

export const NotFound: React.FC = () => (
    <section className={s.section}>
        <div>
            <h1>Страница не найдена</h1>
            <Image src={skull} alt="Not found" />
        </div>

        <div>
            <Link href={"/"}>На главную</Link>
        </div>
    </section>
)
