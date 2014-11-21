/**
 * Created by tmshv on 05/11/14.
 */

var menu = require("../../models/menu.json");

module.exports = function(app) {
    app.service("menu", function ($route) {
        menu.isActive = function (path) {
            if ($route.current && $route.current.regexp) {
                return $route.current.regexp.test(path);
            }
            return false;
        };

        return menu;
    });

    app.controller("MenuController", function ($scope, menu) {
        $scope.vkgroup = menu.vkgroup;
        $scope.menu = menu.menu;

        $scope.isCurrent = function(item) {
            return menu.isActive(item.url);
        };

        $scope.isValid = function(item) {
            return Boolean(item.url);
        };
    });
};