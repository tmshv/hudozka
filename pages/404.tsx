import { NextPage } from "next"
import { Wrapper } from "@/components/Wrapper"
import { NotFound } from "@/components/NotFound"
import { Copyright } from "@/components/Copyright"
import { Spacer } from "@/components/Spacer"
import { Box } from "@/ui/Box"

const Index: NextPage = () => (
    <Wrapper
        header={null}
        footer={(
            <Box as={"footer"}>
                <Spacer />
                <Copyright />
                <Spacer />
            </Box>
        )}
    >
        <Box vertical>
            <NotFound />
            <Spacer />
        </Box>
    </Wrapper>
)

export default Index
