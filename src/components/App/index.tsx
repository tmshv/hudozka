import 'src/style/style.scss'

import dynamic from 'next/dynamic'
import cx from 'classnames'
import { Footer } from '../Footer'
import Comments from '../Comments'
import { useReducedMotion } from 'src/hooks/useReducedMotion'
import { Wrapper } from '../Wrapper'

const Header = dynamic(() => import('./Header'), {
    ssr: false,
})

export interface IAppProps {
    menu: any
    showAuthor: boolean
    menuPadding: boolean
    layout: 'full' | 'wide' | 'thin'
}

export const App: React.FC<IAppProps> = props => {
    const motionDisabled = useReducedMotion()

    return (
        <Wrapper
            header={(
                <header>
                    <div className="navigation">
                        <div className="navigation__body">
                            <Header
                                menuItems={props.menu.items}
                            />
                        </div>
                    </div>
                </header>
            )}
            footer={(
                <Footer
                    showAuthor={props.showAuthor}
                    address=" г. Шлиссельбург ул. 18 января д. 3"
                    telephone="+7 (81362) 76-312"
                    email="hudozka@gmail.com"
                />
            )}
        >
            <section className={cx('content', `content_${props.layout}`, {
                'content--padding-top--menu': props.menuPadding,
                'reduced-motion': motionDisabled,
            })}>
                {props.children}
            </section>

            <Comments />
        </Wrapper>
    )
}
