import { Share } from '../Share'
import { Html } from '../Html'
import { PageMeta } from '../PageMeta'
import { ITag } from 'src/types'

export type PageProps = {
    style?: React.CSSProperties
    children: string
    date: Date
    tags: ITag[]
}

export const Page: React.FC<PageProps> = props => (
    <div className={'Article'} style={props.style}>
        <style jsx>{`
            hr {
                border: 1px solid black;
                margin-top: var(--size-m);
                margin-bottom: var(--size-m);
            }
        `}</style>
        <div className={'Article-Body'}>
            <Html
                html={props.children}
            />
        </div>

        <hr />
        <Share />

        <PageMeta
            style={{
                marginTop: 'var(--size-m)',
            }}
            date={props.date}
            tags={props.tags}
        />
    </div>
)
