// import 'babel-core/register'
// import 'babel-polyfill'

import {render} from 'react-dom'
import getEditApp from './edit'
import TextToken from './edit/features/Marker/lib/marker/TextToken'
import {Marker} from './edit/features/Marker/lib/marker/Marker'
import SplitToken from './edit/features/Marker/lib/marker/SplitToken'
import YoutubeToken from './edit/features/Marker/lib/marker/YoutubeToken'
import {TokenFactory} from './edit/features/Marker/lib/marker/TokenFactory'
import React from 'react'
import UrlToken from './edit/features/Marker/lib/marker/UrlToken'

function getMarker() {
	return (new Marker())
		.addTokenFactory(new TokenFactory({token: SplitToken}))
		.addTokenFactory(new TokenFactory({
			token: YoutubeToken,
			component: ({url}) => (
				<div
					className='MarkerWidgetYoutube'
				>
					<a href={url}>
						{url}
					</a>
				</div>
			)

			// component: ({url}) => (
			// 	<div
			// 		className='MarkerWidgetYoutube'
			// 	>
			// 		<div className='kazimir__video'>
			// 			<iframe
			// 				src={url}
			// 				frameBorder='0'
			// 				allowFullScreen
			// 			/>
			// 		</div>
			// 	</div>
			// )
		}))
		// .addTokenFactory(new TokenFactory({token: InstagramToken}))
		// .addTokenFactory(BuildTokenFactory(DocumentUrlToken, build=read_document))
		// .addTokenFactory(new TokenFactory({token: ImageToken}))
		// .addTokenFactory(BuildTokenFactory(DocumentToken, build=build_document))
		// .addTokenFactory(BuildTokenFactory(CSVToken, build=read_csv))
		// .addTokenFactory(new TokenFactory({token: FileToken}))
		.addTokenFactory(new TokenFactory({
			token: TextToken,
			component: ({html}) => (
				<div
					className='MarkerWidgetHtml'
					dangerouslySetInnerHTML={{__html: html}}
				/>
			)
		}), {
			blank: true,
		})
	// .add_tree_middleware(fix_links_quotes)

	// sample_tree = await marker.create_tree(sample_text)
}

function getData() {
	return `
# Edit	
https://www.youtube.com/watch?v=pxtCffGya9g

Text row
`
	// return [
	//
	// 	'bla-bla',
	// '### pop-pop',
	// 'uiu',
	// 'Url: [ya](http://ya.ru)',
	// ]
}

function main() {
	const mount = document.querySelector('#app')
	const marker = getMarker()
	const data = getData()
	const app = getEditApp(marker, data)

	render(app, mount)
}

main()
