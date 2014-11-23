/**
 * Created by tmshv on 22/11/14.
 */

module.exports = function (app) {
    app.controller("HomePageController", function ($scope, config) {
        $scope.pageClass = "page-home";
        $scope.telephone = config.telephone;

        $(".fotorama").fotorama();
    });
};