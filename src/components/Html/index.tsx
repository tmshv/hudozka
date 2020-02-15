export type HtmlProps = {
    html: string
}

export const Html: React.FC<HtmlProps> = props => (
    <div dangerouslySetInnerHTML={{ __html: props.html }} />
)
