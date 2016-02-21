export default function (app) {
    app.controller('TeamController', ($scope, team) => {
        $scope.teamMembers = team.team.map(person => {
            person.names = team.splitName(person.name);
            return person;
        });
    });
};
