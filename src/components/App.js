import React from 'react'
import { Menu } from './Menu'
import Footer from './Footer'
import Comments from './Comments'

import '../style/style.scss'

export const App = ({children, menu, showAuthor, menuPadding}) => (
	<div className="body-wrapper theme-default">
		<header>
			<div className="navigation">
				<div className="navigation__body">
					<Menu items={menu.items}/>
				</div>
			</div>
		</header>

		<main className="body-wrapper__content">
			<section className={`content content_full ${menuPadding ? 'content--padding-top--menu' : ''}`}>
				{children}
			</section>

			<Comments/>
		</main>

		<Footer showAuthor={showAuthor}
				address=" г. Шлиссельбург ул. 18 января д. 3"
				telephone="+7 (81362) 76-312"
				email="hudozka@gmail.com"
		/>
	</div>
)
