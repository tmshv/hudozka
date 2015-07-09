module.exports = function (app) {
    app.controller('ContactsController', function ($scope, config) {
        $scope.address = config.address;
        $scope.telephone = config.telephone;
        $scope.email = config.email;
    });
};