import {footer} from '../config';

export default function (app) {
    app.controller('AppController', ($scope, menu) => {
        $scope.menuProvider = menu.items;
        $scope.footer = footer;
    });
};
