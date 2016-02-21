/**
 * Created by tmshv on 04/11/14.
 **/

import MainMenu from './components/MainMenu';
import Breadcrumbs from './components/Breadcrumbs';
import Document from './components/Document';
import Award from './components/Award';
import GalleryItem from './components/GalleryItem';
import TeamMemberProfile from './components/TeamMemberProfile';
import AppController from './controllers/AppController';
import HomeController from './controllers/HomeController';
import TeamController from './controllers/TeamController';
import DocumentsController from './controllers/DocumentsController';
import IOService from './services/io';
import MenuService from './services/menu';
import api from './api/api';

let deps = [
    require('./modules/schedule')
].map(m => m.name);

let app = angular.module('hudozka', deps.concat([
    'hudozhka.data',
    'ngRoute',
    'angulartics',
    'angulartics.google.analytics',
    'angularSpinner'
]));

app.config(($locationProvider, $routeProvider) => {
    $locationProvider.hashPrefix('!');
    $locationProvider.html5Mode(true);

    let routes = [
        {
            name: '/',
            templateUrl: '/views/home.html',
            controller: 'HomePageController',
            title: 'ДХШ Шлиссельбурга'
        },
        {
            name: '/schedule/:period?/:semester?',
            templateUrl: '/views/schedule.html',
            controller: 'SchedulePageController',
            title: 'Расписание'
        },
        {
            name: '/team',
            templateUrl: '/views/team.html',
            controller: 'TeamPageController',
            title: 'Преподаватели'
        },
        {
            name: '/gallery',
            templateUrl: '/views/gallery.html',
            controller: 'GalleryPageController',
            title: 'Работы учащихся'
        },
        {
            name: '/gallery/:year/:course/:album',
            templateUrl: '/views/gallery-album.html',
            controller: 'AlbumPageController'
        },
        {
            name: '/docs',
            templateUrl: '/views/docs.html',
            controller: 'DocsPageController',
            title: 'Документы'
        }
    ];

    routes.forEach(route => {
        if (typeof route === 'function') route = route();
        $routeProvider.when(route.name, route);
    });

    $routeProvider.otherwise({
        templateUrl: '/404.html'
    });
});

app.run(($location, $rootScope, $http) => {
    $rootScope.$on('$routeChangeSuccess', (event, current) => {
        let title = current['$$route'].title;
        if (title) $rootScope.title = title;
    });

    $http.defaults.headers.common['Accept'] = 'application/json';
});

[
    api,
    IOService,
    MenuService,
    require('./ui/timeline'),
    require('./filters/strip'),
    require('./filters/remove-hashtags'),
    require('./filters/removeNewline'),
    require('./filters/uppercase-first'),
    require('./pages/schedule'),
    require('./pages/gallery'),
    require('./controllers/ContactsController'),
    require('./controllers/CopyrightController'),
    MainMenu,
    Breadcrumbs,
    Document,
    Award,
    GalleryItem,
    TeamMemberProfile,
    AppController,
    HomeController,
    TeamController,
    DocumentsController,
    function (app) {
        app.controller('HomePageController', ($scope) => {
            $scope.pageClass = 'page-home';
        });

        app.controller('SchedulePageController', ($scope) => {
            $scope.pageClass = 'page-schedule';
        });

        app.controller('DocsPageController', ($scope) => {
            $scope.pageClass = 'page-docs';
        });

        app.controller('TeamPageController', ($scope) => {
            $scope.pageClass = 'page-team';
        });
    }
].map(i => i(app));