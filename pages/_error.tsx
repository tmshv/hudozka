import { NextPage } from 'next'
import { Wrapper } from 'src/components/Wrapper'
import { NotFound } from 'src/components/NotFound'

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
        <NotFound />
    </Wrapper>
)

export default Page
