export default function (app) {
    app.controller('CopyrightController', ($scope, $rootScope) => {
        $scope.developer = true;
        $scope.now = new Date().getFullYear();

        $rootScope.$on('$routeChangeSuccess', (event, current) => {
            let originalPath;
            try{
                originalPath = current['$$route'].originalPath;
            }catch(e){
                originalPath = null;
            }

            $scope.developer = originalPath == '/';
        });
    });
};
