import {splitName} from '../../models/collective';

export default function (app) {
    app.controller('CollectiveController', ($scope, api) => {
        let sort = ['as-timasheva', 'va-sarzhin', 'od-gogoleva', 'my-valkova', 'vv-voronova', 'nv-andreeva'];

        api.collective.collective(sort)
            .success(collective => {
                $scope.members = collective.map(person => {
                    if(person.picture) person.image = person.picture.big.url;
                    person.names = splitName(person.name);
                    return person;
                });
            });
    });
};
