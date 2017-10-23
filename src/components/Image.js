const React = require('react')

module.exports = ({data, alt, opa = true}) => (
	<picture>
		<img
			className={opa ? 'opa' : ''}
			alt={alt}
			src={data.src}
			srcSet={data.set.map(({url, density}) => `${url} ${density}x`)}
		/>
	</picture>
)
