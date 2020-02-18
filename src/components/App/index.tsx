import dynamic from 'next/dynamic'
import cx from 'classnames'
import { Footer } from '../Footer'
import Comments from '../Comments'
import { useReducedMotion } from 'src/hooks/useReducedMotion'
import { Wrapper } from '../Wrapper'
import { Header } from './Header'
const Navigation = dynamic(() => import('../Navigation').then(mod => mod.Navigation), {
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
                <Header>
                    <Navigation
                        items={props.menu.items}
                    />
                </Header>
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
