import { memo } from 'react'

export type HudozkaTitleProps = {
    style?: React.CSSProperties
}

export const HudozkaTitle: React.FC<HudozkaTitleProps> = memo(props => (
    <div style={props.style}>
        <style jsx>{`
            div {
                text-align: center;
            }

            h1 span {
                font-size: var(--font-size-h2);
            }

            @media (max-width: 31.25em) {
                div {
                    --padding: 0 0 2em;
                }
            }
        `}</style>

        <h1>
            <span style={{
                display: 'block',
                marginBottom: 24,
            }}>МБУДО</span>

            Шлиссельбургская <br />
            <span>
                детская художественная школа
            </span>
        </h1>
    </div>
))
