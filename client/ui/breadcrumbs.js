module.exports = function(app) {
    app.directive('breadcrumbs', function () {
        return {
            restrict: 'E',
            templateUrl: '/views/breadcrumbs.html',
            scope: {
                crumbs: '='
            }
        };
    });
};