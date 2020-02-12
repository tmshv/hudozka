import React from 'react'
import { Image } from './Image'

export const CollectiveImage = (props) => (
    <div
        style={props.style}
    >
        <Image
            src={props.data.src}
            alt={props.data.alt}
            set={props.data.set}
            opa={false}
            style={{
                marginBottom: 'var(--double-margin)',
            }}
            imgStyle={{
                width: '100%',
                borderRadius: '10px',
            }}
        />
    </div>
)
