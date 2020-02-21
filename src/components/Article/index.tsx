import { dateFormat } from 'src/lib/date'
import { Share } from '../Share'
import { TagList } from '../TagList'
import { ITag } from 'src/types'

export type ArticleProps = {
    date: string
    title: string
    tags: ITag[]
    shareable: boolean
}

type HeadProps = {
    date: string
    tags: ITag[]
}

const Head: React.FC<HeadProps> = ({ date, tags = [], children }) => (
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

        {!tags.length ? null : (
            <TagList items={tags} />
        )}
    </header>
)

export const Article: React.FC<ArticleProps> = ({ children, date, tags, title, shareable }) => (
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
