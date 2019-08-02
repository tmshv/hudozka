import React from 'react'
import axios from 'axios'
import App from '../../src/components/App'
import Document from '../../src/components/Document'
import Share from '../../src/components/Share'
import menuModel from '../../src/models/menu'
import { buildMenu } from '../../src/lib/menu'

const Page = (props) => (
    <App
        menu={buildMenu(props.pageUrl, menuModel)}
        showAuthor={true}
        menuPadding={true}
    >
        <div className="content content_wide">
            <Document {...props.file} />
            <Share />
        </div>
    </App>
)

Page.getInitialProps = async (ctx) => {
    const pageUrl = '/documents'
    const id = ctx.query.document
    const apiUrl = `http://localhost:3000/api/files/${id}`
    const res = await axios.get(apiUrl)
    const file = res.data

    return {
        file,
        pageUrl,
    }
}

export default Page