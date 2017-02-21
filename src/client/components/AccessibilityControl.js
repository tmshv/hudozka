import template from '../../templates/components/accessibility-control.html'

export default function (app) {
	app.component('accessibilityControl', {
		template,
		controller: ($scope, theme) => {
			$scope.setColorTheme = theme.setColorTheme.bind(theme)
			$scope.setFontTheme = theme.setFontTheme.bind(theme)
			$scope.setFontFamilyTheme = theme.setFontFamilyTheme.bind(theme)
		},
	})
}
