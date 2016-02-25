import {contacts} from '../config';

export default function (app) {
    app.controller('ContactsController', $scope => {
        $scope.address = contacts.address;
        $scope.telephone = contacts.telephone;
        $scope.email = contacts.email;
    });
};
