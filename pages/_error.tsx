import { NextPage } from 'next'
import { Wrapper } from 'src/components/Wrapper'
import { NotFound } from 'src/components/NotFound'
import { Copyright } from 'src/components/Copyright'
import { Block, Spacer } from 'src/components/Block'

const Page: NextPage = () => (
    <Wrapper
        header={null}
        footer={(
            <footer>
                <Block direction={'horizontal'}>
                    <Spacer />
                    <Copyright />
                    <Spacer />
                </Block>
            </footer>
        )}
    >
        <NotFound />
    </Wrapper>
)

export default Page
