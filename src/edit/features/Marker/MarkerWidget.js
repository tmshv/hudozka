import React from 'react'

import './Marker.less'

export const MarkerWidgetText = ({text}) => (
	<div
		className='MarkerWidgetText'
	>
		{text}
	</div>
)

export const MarkerWidgetHtml = ({html}) => (
	<div
		className='MarkerWidgetHtml'
		dangerouslySetInnerHTML={{__html: html}}
	/>
)

export const MarkerWidgetUrl = ({url, text}) => (
	<div
		className='MarkerWidgetUrl'
	>
		<a href={url}>
			{text}
		</a>
	</div>
)
