import React from 'react'
import axios from 'axios'
import App from '../../src/components/App'
import Page from '../../src/components/Page'
import menuModel from '../../src/models/menu'
import { buildMenu } from '../../src/lib/menu'

const Index = (props) => (
    <App
        menu={buildMenu(props.pageUrl, menuModel)}
        showAuthor={true}
        menuPadding={true}
    >
        <div className="content content_thin">
            <Page shareable={true}>
                {props.person.post}
            </Page>
        </div>
    </App>
)

Index.getInitialProps = async (ctx) => {
    const pageUrl = ctx.req.url
    const id = ctx.query.person
    const apiUrl = `http://localhost:3000/api/persons/${id}`
    const res = await axios.get(apiUrl)
    const person = res.data

    return {
        pageUrl,
        person,
    }
}

export default Index