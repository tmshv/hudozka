import React from 'react'
import Head from 'next/head'
import { App } from '../src/components/App'
import { Schedule } from '../src/components/Schedule'
import Share from '../src/components/Share'
import menuModel from '../src/models/menu'
import { buildMenu } from '../src/lib/menu'
import { createApiUrl, requestGet, wrapInitialProps } from '../src/next-lib'

const Page = (props) => (
    <App
        menu={buildMenu(props.pageUrl, menuModel)}
        showAuthor={true}
        menuPadding={true}
        layout={'wide'}
    >
        <Head>
            <title>{props.title}</title>
        </Head>

        {/*<ScheduleList schedules={schedules}/>*/}

        <Schedule {...props.schedule} />

        <Share />
    </App>
)

Page.getInitialProps = wrapInitialProps(async (ctx) => {
    const pageUrl = ctx.req.url
    const period = '2016-2017'
    const semester = 'spring'
    const schedule = await requestGet(createApiUrl(ctx.req, `/api/schedule?period=${period}&semester=${semester}`), {})

    return {
        schedule,
        pageUrl,
        title: 'Расписание',
    }
})

export default Page