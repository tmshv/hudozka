module.exports = function (app) {
    app.controller('CopyrightController', function ($scope, $rootScope) {
        $scope.developer = true;
        $scope.now = new Date().getFullYear();

        $rootScope.$on('$routeChangeSuccess', function (event, current) {
            var originalPath;
            try{
                originalPath = current['$$route'].originalPath;
            }catch(e){
                originalPath = null;
            }

            $scope.developer = originalPath == '/';
        });
    });
};