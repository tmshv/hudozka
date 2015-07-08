module.exports = function (app) {
    app.controller('CopyrightController', function ($scope, $rootScope) {
        $scope.developer = true;
        $scope.now = new Date().getFullYear();

        $rootScope.$on('$routeChangeSuccess', function (event, current) {
            $scope.developer = current['$$route'].originalPath == '/';
        });
    });
};