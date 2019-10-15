import * as React from 'react'
import dynamic from 'next/dynamic'
import { Footer } from '../Footer'
import Comments from '../Comments'

const Header = dynamic(() => import('./Header'), {
    ssr: false,
})

import '../../style/style.scss'

export const App = ({ children, menu, showAuthor, menuPadding }) => (
    <div className="body-wrapper theme-default">
        <header>
            <div className="navigation">
                <div className="navigation__body">
                    <Header
                        menuItems={menu.items}
                    />
                </div>
            </div>
        </header>

        <main className="body-wrapper__content">
            <section className={`content content_full ${menuPadding ? 'content--padding-top--menu' : ''}`}>
                {children}
            </section>

            <Comments />
        </main>

        <Footer
            showAuthor={showAuthor}
            address=" г. Шлиссельбург ул. 18 января д. 3"
            telephone="+7 (81362) 76-312"
            email="hudozka@gmail.com"
        />
    </div>
)
