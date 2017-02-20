import template from '../../templates/components/accessibility-control.html'

export default function (app) {
	app.component('accessibilityControl', {
		template,
		controller: ($scope, theme) => {
			const themeSet = {
				accessibility: 'accessibility',
				color: '',
				fontSize: '',
				fontFamily: '',
			}

			const install = () => {
				const baked = Object
					.values(themeSet)
					.filter(Boolean)
					.join(' ')
				theme.setTheme(baked)
			}

			$scope.setColorTheme = (color) => {
				themeSet.color = color
				install()
			}

			$scope.setFontTheme = (font) => {
				themeSet.fontSize = font
				install()
			}

			$scope.setFontFamilyTheme = (font) => {
				themeSet.fontFamily = font
				install()
			}
		},
	})
}
