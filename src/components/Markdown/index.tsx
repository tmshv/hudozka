import { Html } from 'src/components/Html'
import MarkdownIt from 'markdown-it'
import Typograf from 'typograf'
import { memo } from 'react'

const tp = new Typograf({ locale: ['ru'] })
const md = new MarkdownIt({
    html: true,
})

export type MarkdownProps = {
    data: string
}

export const Markdown: React.SFC<MarkdownProps> = memo(props => (
    <Html
        html={tp.execute(md.render(props.data))}
    />
))
