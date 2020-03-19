import MarkdownIt from 'markdown-it'
import Typograf from 'typograf'

const tp = new Typograf({ locale: ['ru'] })
const md = new MarkdownIt({
    html: true,
})

export type MarkdownProps = {
    data: string
}

export function markdownToHtml(data: string): string {
    return md.render(data)
}

export function typograf(data: string): string {
    return tp.execute(data)
}
