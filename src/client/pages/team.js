var populate = require('../../utils/populate').populate;

module.exports = function (app) {
    app.controller('TeamPageController', function ($scope, team) {
        $scope.pageClass = 'page-team';

        $scope.teamMembers = team.team.map(function (person) {
            person.names = team.splitName(person.name);
            return person;
        });
    });
};