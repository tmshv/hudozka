export default function (app) {
	app.component('themeSelector', {
		template: `
			<p ng-click="toggleTheme()">
				<span ng-hide="isMainTheme" title="Выключить версию для слабовидящих"><i class="fa fa-eye" aria-hidden="true"></i></span>
				<span ng-show="isMainTheme" title="Включить версию для слабовидящих"><i class="fa fa-eye-slash" aria-hidden="true"></i></span>
			</p>
		`,
		controller: ($scope, theme) => {
			const update = () => {
				$scope.isMainTheme = theme.isDefaultTheme()
			}

			$scope.toggleTheme = () => {
				theme.toggle()
				update()
			}

			update()
		},
	})
};
