import 'src/style/style.scss'

import { NextPage } from 'next'
import { Wrapper } from 'src/components/Wrapper'

const Page: NextPage = () => (
    <Wrapper
        header={null}
        footer={(
            <footer className="footer--centered">
                <div className="copyright">
                    <span>©&nbsp;2012—2019 Шлиссельбургская детская художественная школа</span>
                </div>
            </footer>
        )}
    >
        <section className="error-404">
            <div>
                <h1>Страница не найдена.</h1>
                <img src="/static/graphics/skull.jpg" />
            </div>

            <div><a href="/">На главную</a></div>
        </section>
    </Wrapper>
)

export default Page
