const React = require('react')

const mailto = email => `mailto:${email}`
const currentYear = () => (new Date()).getFullYear()

const Footer = ({children, address, telephone, email, showAuthor}) => (
	<footer>
		<div className="contacts">
			<div>
				<h4>Контактная информация</h4>
				<p>Адрес: {address}</p>
				<p>Телефон: {telephone}</p>
				<p>Почта: <a href={mailto(email)}>{email}</a></p>
				<p>Вконтакте: <a href="https://vk.com/shlisselburghudozka">shlisselburghudozka</a></p>
				<p>Инстаграм: <a href="https://www.instagram.com/hudozka/">hudozka</a></p>
			</div>
		</div>

		<div className="copyright">
            <Copyright
                yearStart={2012}
                yearEnd={currentYear()}
            />
			{!showAuthor ? null : (
                <Author/>
			)}
		</div>
	</footer>
)

const Author = () => (
    <span>
		Разработка и поддержка сайта —
		<a href="http://tmshv.ru?utm_source=artshburg&utm_medium=developer&utm_campaign=tmshv_ru">
			www.tmshv.ru
		</a>
	</span>
)

const Copyright = ({yearStart, yearEnd}) => (
    <span>©&nbsp;{yearStart}—{yearEnd} Шлиссельбургская детская художественная школа</span>
)

module.exports = Footer
