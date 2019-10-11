import React from 'react'
import axios from 'axios'
import Head from 'next/head'
import { App } from '../src/components/App'
import { Meta } from '../src/components/Meta'
import { CollectiveImage } from '../src/components/CollectiveImage'
import PersonCard from '../src/components/PersonCard'
import { CardList } from '../src/components/CardList'
import menuModel from '../src/models/menu'
import { buildMenu } from '../src/lib/menu'
import { meta } from '../src/lib/meta'
import { createApiUrl } from '../src/next-lib'

const Page = (props) => (
    <App
        menu={buildMenu(props.pageUrl, menuModel)}
        showAuthor={true}
        menuPadding={true}
    >
        <Head>
            <title>{props.title}</title>
            <Meta meta={props.meta} />
        </Head>

        <div className="content content_semi-wide">
            {!props.image ? null : (
                <CollectiveImage
                    data={props.image}
                    style={{
                        marginBottom: 'var(--double-margin)',
                    }}
                />
            )}

            <CardList
                items={props.persons}
                renderItem={(person, index) => (
                    <PersonCard
                        key={index}
                        profile={person}
                        picture={person.picture}
                        url={person.url}
                        name={person.name}
                    />
                )}
            />
        </div>
    </App>
)

Page.getInitialProps = async (ctx) => {
    const pageUrl = ctx.req.url

    const res = await axios.get(createApiUrl(ctx.req, '/api/persons'))
    const persons = res.data.items
    const title = 'Преподаватели Шлиссельбургской ДХШ'
    const imageFile = 'Images/HudozkaCollective2017.jpg'
    const resImage = await axios.get(createApiUrl(ctx.req, `/api/image?file=${imageFile}`))

    return {
        persons,
        image: resImage.data.artifacts.large,
        pageUrl,
        title,
        meta: meta({
            title,
            url: pageUrl,
            description: 'Преподаватели Шлиссельбургской ДХШ',
        })
    }
}

export default Page