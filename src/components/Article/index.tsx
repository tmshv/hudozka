import { dateFormat } from 'src/lib/date'
import { Share } from '../Share'

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
        <style jsx>{`
            .date {
                color: var(--color-text-second);
            }
        `}</style>

        <h1>{children}</h1>

        {!date ? null : (
            <p className={'date'}>{dateFormat(date)}</p>
        )}

        {!(tags.length) ? null : (
            <TagList tags={tags} />
        )}
    </header>
)

export const Article = ({ children, date, tags, title, shareable }) => (
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
