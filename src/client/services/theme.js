const themes = {
	main: 'style.css',
	accessibility: 'style-accessibility.css',
}

const defaultTheme = 'main'

class Theme {
	constructor($rootScope) {
		this.mainTheme = defaultTheme
		this.currentTheme = null

		const getTheme = value => themes[value]
		const setTheme = value => {
			const theme = value in themes ? value : defaultTheme
			localStorage.setItem('theme', theme)
			this.currentTheme = theme
			$rootScope.theme = getTheme(theme)
		}

		setTheme(localStorage.getItem('theme'))

		this.toggle = () => {
			const t = this.currentTheme === 'main' ? 'accessibility' : 'main'
			setTheme(t)
		}
	}
}

export default function (app) {
	app.service('theme', Theme)
}
