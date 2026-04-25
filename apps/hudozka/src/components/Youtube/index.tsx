export type YoutubeProps = {
    url: string
}

export function Youtube(props: YoutubeProps) {
    const url = new URL(props.url)
    const videoId = url.searchParams.get("v")
    if (!videoId) {
        return null
    }

    const src = `//www.youtube.com/embed/${videoId}`

    return (
        <div className="kazimir__video">
            <iframe title="YouTube video player" src={src} frameBorder="0" />
        </div>
    )
}
