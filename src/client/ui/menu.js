/**
 * Created by tmshv on 05/11/14.
 */

import menuItems from '../../models/menu';

module.exports = function (app) {
    app.factory("menu", function ($route, $rootScope) {
        function Menu() {
            this.items = menuItems;
            this.current = null;
        }

        Menu.prototype.activate = function (path) {
            var f = this.items.filter(function (i) {
                return i.url === path;
            });

            if (f.length) {
                this.current = f[0];
            }
        };

        var menu = new Menu();
        $rootScope.$on('$routeChangeSuccess', function (event, current) {
            try {
                var path = current['$$route'].originalPath;
                menu.activate(path);
            } catch (e) {

            }
        });

        return menu;
    });
};