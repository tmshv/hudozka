import template from '../../templates/components/accessibility-control.html'

export default function (app) {
	app.component('accessibilityControl', {
		template,
		controller: ($scope, theme) => {

			$scope.scopes = {
				color: [
					['bw', 'белым по черному'],
					['wb', 'черным по белому'],
				],

				fontSize: [
					['normal', 'нормальный'],
					['big', 'большой'],
					['biggest', 'огромный'],
				],

				fontFamily: [
					['sans', 'без засечек'],
					['serif', 'с засечками'],
				],

				image: [
					['yesImg', 'отображаются'],
					['noImg', 'спрятаны'],
				],

				kerning: [
					['normal', 'обычный'],
					['big', 'увеличенный'],
				],
			}

			$scope.isActive = (scope, [name,]) => theme.isActive(scope, name)

			$scope.setDefaultTheme = () => theme.toggle()
			$scope.setDefaultSettings = () => theme.setDefaultAccessibilityTheme()

			$scope.setColorTheme = theme.setColorTheme.bind(theme)
			$scope.setFontTheme = theme.setFontTheme.bind(theme)
			$scope.setFontFamilyTheme = theme.setFontFamilyTheme.bind(theme)
			$scope.setImageTheme = theme.setImageTheme.bind(theme)
			$scope.setKerningTheme = theme.setKerningTheme.bind(theme)
		},
	})
}
