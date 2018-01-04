const React = require('react')

const mailto = email => `mailto:${email}`

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
			<span>©&nbsp;2012—2017 Шлиссельбургская детская художественная школа</span>
			{!showAuthor ? null : (
				<span>Разработка и поддержка сайта —
					<a href="http://tmshv.ru?utm_source=artshburg&utm_medium=developer&utm_campaign=tmshv_ru">
						www.tmshv.ru
					</a>
				</span>
			)}
		</div>
	</footer>
)

module.exports = Footer
