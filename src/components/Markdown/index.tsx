import { Html } from 'src/components/Html'
import { memo } from 'react'
import { typograf, markdownToHtml } from 'src/lib/text'

export type MarkdownProps = {
    data: string
}

export const Markdown: React.SFC<MarkdownProps> = memo(props => (
    <Html
        html={typograf(markdownToHtml(props.data))}
    />
))
