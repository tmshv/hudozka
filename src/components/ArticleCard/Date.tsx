import * as React from 'react'
import { dateFormat } from '../../lib/date'

export const Date: React.FC<{ children: string }> = ({ children }) => (
    <p>
        <style jsx>{`
            p {
                color: #ccc;
                font-size: small;
            }
        `}</style>
        {dateFormat(children)}
    </p>
)
