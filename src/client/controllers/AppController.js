export default function (app) {
    app.controller('AppController', ($scope, menu) => {
        $scope.menuProvider = menu.items;
    });
};
