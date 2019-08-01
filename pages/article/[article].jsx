import React from 'react'
import axios from 'axios'
import App from '../../src/components/App'
import Article from '../../src/components/Article'
import Html from '../../src/components/Html'
import menuModel from '../../src/models/menu'
import { buildMenu } from '../../src/lib/menu'

const Page = (props) => (
    <App
        menu={buildMenu(props.pageUrl, menuModel)}
        showAuthor={true}
        menuPadding={true}
    >
        <div className={'content content_thin'}>
            <Article
                title={props.article.title}
                date={props.article.date}
                tags={props.article.tags}
                shareable={true}
            >
                <Html
                    html={props.article.post}
                />
            </Article>
        </div>
    </App>
)

Page.getInitialProps = async (ctx) => {
    const pageUrl = ctx.req.url
    const id = ctx.query.article
    const apiUrl = `http://localhost:3000/api/articles/${id}`
    const res = await axios.get(apiUrl)
    const article = res.data

    return {
        article,
        pageUrl,
    }
}

export default Page