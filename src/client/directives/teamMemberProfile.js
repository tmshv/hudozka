module.exports = function (app) {
    app.directive('teamMemberProfile', function (menu) {
        return {
            restrict: 'E',
            templateUrl: '/views/team/profile.html',
            scope: {
                person: '=profile'
            },
            link: function(scope, element){
            }
        }
    });
};