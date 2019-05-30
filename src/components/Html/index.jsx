import React from 'react'

export default function Html(props) {
    return (
        <div dangerouslySetInnerHTML={{ __html: props.html }} />
    )
}


