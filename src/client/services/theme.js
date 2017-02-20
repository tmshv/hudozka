const defaultTheme = 'theme-default'
const defaultAccessibilityTheme = 'accessibility theme-accessibility-black-white'

const getTheme = () => localStorage.getItem('theme')

const isDefaultTheme = () => {
	const theme = getTheme()
	if (!theme) return true
	return theme === defaultTheme
}

class Theme {
	constructor($rootScope) {
		this.mainTheme = defaultTheme
		this.currentTheme = defaultAccessibilityTheme

		this.toggle = () => {
			if (isDefaultTheme()) {
				this.setTheme(this.currentTheme)
			} else {
				this.setMainTheme()
			}
		}

		this.setTheme = (themeName) => {
			if (!themeName) {
				this.setMainTheme()
			} else {
				localStorage.setItem('theme', themeName)
				this.currentTheme = themeName
				$rootScope.theme = themeName
			}
		}

		this.setMainTheme = () => {
			localStorage.removeItem('theme')
			$rootScope.theme = this.mainTheme
		}

		this.setTheme(getTheme())
	}
}

export default function (app) {
	app.service('theme', Theme)
}
