import { Copyright } from '../Copyright'
import { Author } from './Author'
import { Block, Spacer } from '../Block'

const mailto = email => `mailto:${email}`

export interface IFooterProps {
    address: string
    telephone: string
    email: string
    showAuthor: boolean
}

export const Footer: React.FC<IFooterProps> = props => (
    <footer>
        <div className="contacts">
            <div>
                <h4>Контактная информация</h4>
                <p>Адрес: {props.address}</p>
                <p>Телефон: {props.telephone}</p>
                <p>Почта: <a href={mailto(props.email)}>{props.email}</a></p>
                <p>Вконтакте: <a href="https://vk.com/shlisselburghudozka">shlisselburghudozka</a></p>
                <p>Инстаграм: <a href="https://www.instagram.com/hudozka/">hudozka</a></p>
            </div>
        </div>

        <Block direction={'horizontal'} style={{
            padding: '1.5em 1em 0.25em',
        }}>
            <Copyright />

            {!props.showAuthor ? null : (
                <>
                    <Spacer />
                    <Author />
                </>
            )}
        </Block>
    </footer >
)

