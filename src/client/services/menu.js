import menuItems from '../../models/menu';

class Menu {
    constructor() {
        this.items = menuItems;
        this.current = null;
    }

    activate(path) {
        let filteredItems = this.items.filter(i => i.url === path);

        if (filteredItems.length) {
            this.current = filteredItems[0];
        }
    }
}

export default function (app) {
    app.factory('menu', ($route, $rootScope) => {
        const menu = new Menu();
        $rootScope.$on('$routeChangeSuccess', (event, current) => {
            try {
                let path = current['$$route'].originalPath;
                menu.activate(path);
            } catch (e) {

            }
        });

        return menu;
    });
};
