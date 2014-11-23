/**
 * Created by tmshv on 22/11/14.
 */

module.exports = function (app) {
    app.controller("HomePageController", function ($scope) {
        $scope.pageClass = "page-home";

        $(".fotorama").fotorama();
    });
};