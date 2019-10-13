import React from 'react'
import '../src/style/style.scss'

const Page = props => (
    <div className="body-wrapper">
        <main className="body-wrapper__content">
            <section className="error-404">
                <div>
                    <h1>Страница не найдена.</h1>
                    <img src="/static/graphics/skull.jpg" />
                </div>

                <div><a href="/">На главную</a></div>
            </section>
        </main>

        <footer className="footer--centered">
            <div className="copyright">
                <span>©&nbsp;2012—2019 Шлиссельбургская детская художественная школа</span>
            </div>
        </footer>
    </div>
)

export default Page