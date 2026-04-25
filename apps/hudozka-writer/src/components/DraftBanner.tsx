import "./DraftBanner.css"

export type DraftBannerProps = {
    onDiscard: () => void
}

export function DraftBanner({ onDiscard }: DraftBannerProps) {
    return (
        <div className="draft-banner">
            <span>You have unpublished changes</span>
            <button type="button" onClick={onDiscard} className="draft-banner-discard">
                Discard
            </button>
        </div>
    )
}
