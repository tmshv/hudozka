const defaultTheme = 'theme-default'

const themeScheme = {
	accessibility: 'accessibility',

	color: {
		wb: 'theme-accessibility-white-black',
		bw: 'theme-accessibility-black-white',
	},

	font: {
		sans: 'theme-accessibility-font-sans',
		serif: 'theme-accessibility-font-serif',
	},

	fontSize: {
		normal: 'theme-accessibility-font-normal',
		big: 'theme-accessibility-font-big',
		biggest: 'theme-accessibility-font-biggest',
	},
}

const defaultAccessibilityTheme = () => ({
	version: '1',
	theme: {
		accessibility: 'accessibility',
		color: 'wb',
		font: 'sans',
		fontSize: 'big',
	},
})

function loadTheme() {
	const theme = localStorage.getItem('theme')
	try {
		return JSON.parse(theme)
	} catch (error) {
		return null
	}
}

function saveTheme(theme) {
	if (!theme) return theme
	const str = typeof theme === 'string'
		? theme
		: JSON.stringify(theme)
	localStorage.setItem('theme', str)
	return theme
}

function resetTheme() {
	localStorage.removeItem('theme')
}

function compileTheme(item) {
	if (!item) return defaultTheme
	const {theme, version} = item
	if (!version) return defaultTheme

	const cssClass = ([scope, name]) => {
		try {
			return themeScheme[scope][name]
		} catch (error) {
			return null
		}
	}

	return Object
		.entries(theme)
		.map(cssClass)
		.filter(Boolean)
		.join(' ')
}

class Theme {
	constructor($rootScope) {
		this.mainTheme = defaultTheme
		this.themeSetup = defaultAccessibilityTheme()
		this.__scope = $rootScope

		this.setTheme(loadTheme())
	}

	toggle() {
		if (this.isDefaultTheme()) {
			this.setTheme(this.themeSetup)
		} else {
			this.setMainTheme()
		}
	}

	setMainTheme() {
		resetTheme()
		this.__scope.theme = this.mainTheme
	}

	setTheme(theme) {
		if (!theme) {
			this.setMainTheme()
		} else {
			const css = compileTheme(theme)

			saveTheme(theme)
			this.themeSetup = theme
			this.__scope.theme = css
		}
	}

	setColorTheme(theme) {
		this.themeSetup.theme.color = theme
		this.install()
	}

	setFontTheme(theme) {
		this.themeSetup.theme.fontSize = theme
		this.install()
	}

	setFontFamilyTheme(theme) {
		this.themeSetup.theme.font = theme
		this.install()
	}

	install() {
		this.setTheme(this.themeSetup)
	}

	isDefaultTheme(){
		const theme = loadTheme()
		return !theme // default theme cleared up local storage
	}
}

export default function (app) {
	app.service('theme', Theme)
}
