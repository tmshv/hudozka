/**
 * Created by tmshv on 05/11/14.
 */

module.exports = function (app) {
    app.factory("menu", function ($route, $rootScope) {
        function Menu() {
            this.items = require("../../models/menu.json");
            this.current = null;
        }

        Menu.prototype.activate = function (path) {
            var f = this.items.filter(function (i) {
                return i.url === path;
            });

            if(f.length) {
                this.current = f[0];
            }
        };

        var menu = new Menu();
        $rootScope.$on('$routeChangeSuccess', function (event, current) {
            var path = current['$$route'].originalPath;
            menu.activate(path);
        });

        return menu;
    });

    app.controller("MenuController", function ($scope, menu) {
        $scope.menu = menu;

        $scope.isActive = function (item) {
            if(menu.current) {
                return item.url == menu.current.url;
            }else{
                return false;
            }
        };

        $scope.isValid = function (item) {
            return 'url' in item;
        };
    });
};