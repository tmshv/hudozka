import s from './error.module.css'

import Link from 'next/link'

export const NotFound: React.FC = () => (
    <section className={s.section}>
        <div>
            <h1>Страница не найдена</h1>
            <img src="/static/graphics/skull.jpg" />
        </div>

        <div>
            <Link href={'/'}>
                <a>На главную</a>
            </Link>
        </div>
    </section>
)
