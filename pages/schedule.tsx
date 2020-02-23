import Head from 'next/head'
import { App } from 'src/components/App'
import { Schedule } from 'src/components/Schedule'
import { Share } from 'src/components/Share'
import { createApiUrl, requestGet } from 'src/next-lib'
import { NextPage } from 'next'

type Props = {
    title: string
    data: any //(schedule)
}

const Page: NextPage<Props> = props => (
    <App
        showAuthor={true}
        wide={true}
    >
        <Head>
            <title>{props.title}</title>
        </Head>

        <Schedule {...props.data} />

        <Share />
    </App>
)

export const unstable_getStaticProps = async (ctx: any) => {
    const period = '2016-2017'
    const semester = 'spring'
    const data = await requestGet(createApiUrl(`/api/schedule?period=${period}&semester=${semester}`), null)
    if (!data) {
        return null
    }

    return {
        props: {
            data,
            title: 'Расписание',
        }
    }
}

export default Page
