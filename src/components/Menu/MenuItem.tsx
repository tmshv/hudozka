import * as React from 'react'

export interface IMenuItemProps {
    active: boolean
    text: string
    url: string
}

export const MenuItem: React.FC<IMenuItemProps> = ({ active, text, url }) => (
   <>
        <style jsx>{`
            a {
                color: var(--dark-color);
            }

            a:visited {
                color: var(--dark-color);
            }

            a:hover {
                border-color: var(--dark-color);
            }
        `}</style>

        {active
            ? (
                <span>{text}</span>
            ) : (
                <a href={url}>{text}</a>
            )
        }
    </>
)