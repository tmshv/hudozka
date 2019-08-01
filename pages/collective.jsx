import React from 'react'
import axios from 'axios'
import App from '../src/components/App'
import CollectiveImage from '../src/components/CollectiveImage'
import PersonCard from '../src/components/PersonCard'
import menuModel from '../src/models/menu'
import { buildMenu } from '../src/lib/menu'

function getMeta(article) {
    return {
        title: article.title,
    }
}

const PersonCardList = ({ children }) => (
    <div className="PersonCardList">
        {children}
    </div>
)

const Page = (props) => (
    <App
        menu={buildMenu(props.pageUrl, menuModel)}
        showAuthor={true}
        menuPadding={true}
    >
        <div className="content content_semi-wide">
            {!props.image ? null : (
                <CollectiveImage data={props.image} />
            )}

            <PersonCardList>
                {props.persons.map((person, index) => (
                    <PersonCard
                        key={index}
                        profile={person}
                        picture={person.picture}
                        url={person.url}
                        name={person.name}
                    />
                ))}
            </PersonCardList>
        </div>
    </App>
)

Page.getInitialProps = async (ctx) => {
    const pageUrl = ctx.req.url
    const apiUrl = `http://localhost:3000/api/persons`
    const res = await axios.get(apiUrl)
    const persons = res.data.items

    const imageFile = 'Images/HudozkaCollective2017.jpg'
    const imageUrl = `http://localhost:3000/api/image?file=${imageFile}`
    const resImage = await axios.get(imageUrl)

    return {
        persons,
        image: resImage.data,
        pageUrl,
    }
}

export default Page