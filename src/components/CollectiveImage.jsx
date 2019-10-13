import React from 'react'
import Image from './Image'

export const CollectiveImage = (props) => (
    <div
        className="CollectiveImage"
        style={props.style}
    >
        <style jsx>{`
            .CollectiveImage {
                margin - bottom: var(--double-margin);
            }

            img {
                width: 100%;
                border-radius: 10px;
            }
        `}</style>

        <Image
            data={props.data}
            opa={false}
        />
	</div>
)
