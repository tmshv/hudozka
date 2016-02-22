/**
 * Created by tmshv on 04/11/14.
 **/

import MainMenu from './components/MainMenu';
import Breadcrumbs from './components/Breadcrumbs';
import Document from './components/Document';
import Award from './components/Award';
import GalleryItem from './components/GalleryItem';
import TeamMemberProfile from './components/TeamMemberProfile';
import Timeline from './components/Timeline';
import TimelineRecord from './components/TimelineRecord';
import TimelineRecordPost from './components/TimelineRecordPost';
import TimelineRecordInstagram from './components/TimelineRecordInstagram';
import Schedule from './components/Schedule';
import ScheduleTable from './components/ScheduleTable';
import ScheduleSlider from './components/ScheduleSlider';
import ScheduleSlide from './components/ScheduleSlide';
import ScheduleRecord from './components/ScheduleRecord';
import AppController from './controllers/AppController';
import HomeController from './controllers/HomeController';
import ScheduleController from './controllers/ScheduleController';
import TeamController from './controllers/TeamController';
import GalleryController from './controllers/GalleryController';
import AlbumController from './controllers/AlbumController';
import DocumentsController from './controllers/DocumentsController';
import CopyrightController from './controllers/CopyrightController';
import ContactsController from './controllers/ContactsController';
import RemoveHashtags from './filters/RemoveHashtags';
import RemoveNewline from './filters/RemoveNewline';
import Strip from './filters/Strip';
import UppercaseFirst from './filters/UppercaseFirst';
import IOService from './services/io';
import MenuService from './services/menu';
import api from './api/api';

let app = angular.module('hudozka', [
    'hudozhka.data',
    'ngRoute',
    'angulartics',
    'angulartics.google.analytics',
    'angularSpinner'
]);

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
    RemoveHashtags,
    RemoveNewline,
    Strip,
    UppercaseFirst,
    MainMenu,
    Breadcrumbs,
    Timeline,
    TimelineRecord,
    TimelineRecordPost,
    TimelineRecordInstagram,
    Document,
    Award,
    GalleryItem,
    TeamMemberProfile,
    AppController,
    HomeController,
    ScheduleController,
    TeamController,
    GalleryController,
    AlbumController,
    DocumentsController,
    CopyrightController,
    ContactsController,
    Schedule,
    ScheduleTable,
    ScheduleSlider,
    ScheduleSlide,
    ScheduleRecord,
    function (app) {
        app.controller('HomePageController', ($scope) => {
            $scope.pageClass = 'page-home';
        });

        app.controller('SchedulePageController', ($scope) => {
            $scope.pageClass = 'page-schedule';
        });

        app.controller('GalleryPageController', ($scope) => {
            $scope.pageClass = 'page-gallery';
        });

        app.controller('AlbumPageController', ($scope) => {
            $scope.pageClass = 'page-album';
        });

        app.controller('DocsPageController', ($scope) => {
            $scope.pageClass = 'page-docs';
        });

        app.controller('TeamPageController', ($scope) => {
            $scope.pageClass = 'page-team';
        });
    }
].map(i => i(app));