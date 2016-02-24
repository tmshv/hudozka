import {collectiveSortPattern} from '../config';

export default function (app) {
    app.controller('CollectiveController', ($scope, api) => {
        api.collective.list(collectiveSortPattern)
            .success(collective => {
                $scope.members = collective;
                collective.map(person => {

                    return person;
                });
            });
    });
};
