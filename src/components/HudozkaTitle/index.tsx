import * as React from 'react'

export const HudozkaTitle: React.FC = React.memo(() => (
    <div>
        <style jsx>{`
            div {
                --padding: var(--double-margin) 0;

                padding: var(--padding);
                text-align: center;
            }

            h1 span {
                font-size: var(--font-size-h2);
            }

            @media (max-width: 31.25em) {
                div {
                    --padding: 0 0 var(--double-margin);
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
