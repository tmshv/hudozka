import { NextPage } from 'next'
import { Wrapper } from 'src/components/Wrapper'
import { NotFound } from 'src/components/NotFound'
import { Copyright } from 'src/components/Copyright'

const Page: NextPage = () => (
    <Wrapper
        header={null}
        footer={(
            <footer className="footer--centered">
                <div className="copyright">
                    <Copyright />
                </div>
            </footer>
        )}
    >
        <NotFound />
    </Wrapper>
)

export default Page
