export type YoutubeProps = {
    url: string
}

export const Youtube: React.FC<{ url: string }> = props => {
    const url = new URL(props.url)
    const videoId = url.searchParams.get('v')
    if (!videoId) {
        return null
    }

    const src = `//www.youtube.com/embed/${videoId}`

    return (
        <div className="kazimir__video">
            <iframe
                src={src}
                frameBorder="0"
            // allowFullscreen
            />
        </div>
    )
}
