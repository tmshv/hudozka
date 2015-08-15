module.exports = function (app) {
    app.directive('mainMenu', function (menu) {
        return {
            restrict: 'E',
            templateUrl: '/views/menu.html',
            scope: {
                menu: '=items'
            },
            link: function(scope, element){
                scope.isActive = function (item) {
                    if (menu.current) {
                        return item.url == menu.current.url;
                    } else {
                        return false;
                    }
                };

                scope.isValid = function (item) {
                    return 'url' in item;
                };
            }
        }
    });
};