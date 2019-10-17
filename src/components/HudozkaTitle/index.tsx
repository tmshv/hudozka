import * as React from 'react'

export const HudozkaTitle: React.FC = React.memo(() => (
    <div>
        <style jsx>{`
            div {
                --padding: var(--double-margin) 0;

                padding: var(--padding);
                text-align: center;
            }

            p {
                color: var(--text-color-second);
                margin-top: var(--single-margin);
                font-size: var(--font-size-second);
            }

            h1 {
                margin-top: var(--single-margin);
            }

            @media (max-width: 31.25em) {
                div {
                    --padding: 0 0 var(--double-margin);
                }
            }
        `}</style>

        <p>МБУДО</p>
        <h1>Шлиссельбургская <br /> детская художественная школа</h1>
    </div>
))
