import React from 'react'
import axios from 'axios'
import Head from 'next/head'
import { App } from '../src/components/App'
import Schedule from '../src/components/Schedule'
import Share from '../src/components/Share'
import menuModel from '../src/models/menu'
import { buildMenu } from '../src/lib/menu'
import { createApiUrl } from '../src/next-lib'

const Page = (props) => (
    <App
        menu={buildMenu(props.pageUrl, menuModel)}
        showAuthor={true}
        menuPadding={true}
    >
        <Head>
            <title>{props.title}</title>
        </Head>

        <div className="content content_wide">
            {/*<ScheduleList schedules={schedules}/>*/}

            <Schedule {...props.schedule} />

            <Share />
        </div>
    </App>
)

Page.getInitialProps = async (ctx) => {
    const pageUrl = ctx.req.url
    const period = '2016-2017'
    const semester = 'spring'
    const res = await axios.get(createApiUrl(ctx.req, `/api/schedule?period=${period}&semester=${semester}`))
    const schedule = res.data

    return {
        schedule,
        pageUrl,
        title: 'Расписание',
    }
}

export default Page