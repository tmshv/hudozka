export default function (app) {
    app.controller('ContactsController', ($scope, config) => {
        $scope.address = config.address;
        $scope.telephone = config.telephone;
        $scope.email = config.email;
    });
};
