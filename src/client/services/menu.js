import menuItems from '../../models/menu';

class Menu {
    constructor(items) {
        this.items = items;
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
    app.factory('menu', ($rootScope) => {
        const menu = new Menu(menuItems);

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
