import {splitName} from '../../models/collective';
import {collectiveSortPattern} from '../config';

export default function (app) {
    app.controller('CollectiveController', ($scope, api) => {
        api.collective.collective(collectiveSortPattern)
            .success(collective => {
                $scope.members = collective.map(person => {
                    if (person.picture) person.image = person.picture.big.url;
                    person.names = splitName(person.name);
                    return person;
                });
            });
    });
};
