import {footer, mobileMatchSelector, contacts} from '../config';

export default function (app) {
    app.controller('AppController', ($scope, menu) => {
        try {
            if (window.matchMedia(mobileMatchSelector).matches) {
                $scope.navigation = 'navigation';
            }else{
                $scope.navigation = 'main-menu';
            }
        } catch (e) {
            $scope.navigation = 'main-menu';
        }

        $scope.phone = contacts.telephone;
        $scope.menuProvider = menu.items;
        $scope.footer = footer;
    });
};
