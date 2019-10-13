import React from 'react'
import { dateFormat } from '../lib/date'

const Tag = ({ children }) => (
    <li className="ArticleTags-Item">
        {children}
    </li>
)

const TagList = ({ tags }) => (
    <ul className="ArticleTags">
        {tags.map((x, i) => (
            <Tag key={i}># {x.name}</Tag>
        ))}
    </ul>
)

const Head = ({ date, tags = [], children }) => (
    <header className="Article-Head">
        <h1>{children}</h1>

        {!date ? null : (
            <p className="date">{dateFormat(date)}</p>
        )}

        {!(tags.length) ? null : (
            <TagList tags={tags} />
        )}
    </header>
)

const Share = () => (
    <div className="likely">
        <div className="vkontakte">Поделиться</div>
        <div className="facebook">Поделиться</div>
        <div className="telegram">Отправить</div>
        <div className="twitter">Твитнуть</div>
    </div>
)

const Article = ({ children, date, tags, title, shareable }) => (
    <article className="Article">
        <Head
            date={date}
            tags={tags}
        >
            {title}
        </Head>

        <div className="Article-Body">
            {children}
        </div>

        {!shareable ? null : (
            <Share />
        )}
    </article>
)

export default Article
