var populate = require("../../utils/populate").populate;
const course = require("../../models/course");

module.exports = function (app) {
    app.controller("TeamController", function ($scope, team) {
        $scope.team = team.team.map(function (person) {
            person.names = team.splitName(person.name);
            return person;
        });
    });
};