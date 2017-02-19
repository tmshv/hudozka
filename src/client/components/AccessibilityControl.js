import template from '../../templates/components/accessibility-control.html'

export default function (app) {
	app.component('accessibilityControl', {
		template,
		controller: ($scope, theme) => {
			//const update = () => {
			//	$scope.isMainTheme = theme.currentTheme === theme.mainTheme
			//}
			//
			//$scope.toggleTheme = () => {
			//	theme.toggle()
			//	update()
			//}
			//
			//update()
		},
	})
}
