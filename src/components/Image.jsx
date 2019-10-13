import React from 'react'
import className from 'classnames'

export const Image = ({data, alt, opa = true}) => (
    <picture>
        <style jsx>{`
            picture img {
                display: block;
            }
        `}</style>

		<img
            className={className({ opa })}
			alt={alt}
			src={data.src}
			srcSet={data.set.map(({url, density}) => `${url} ${density}x`)}
		/>
	</picture >
)

export default Image