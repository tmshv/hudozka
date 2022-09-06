import s from './error.module.css'

export const NotFound: React.FC = () => (
    <section className={s.section}>
        <div>
            <h1>Страница не найдена</h1>
            <img src="/static/graphics/skull.jpg" />
        </div>

        <div><a href="/">На главную</a></div>
    </section>
)
