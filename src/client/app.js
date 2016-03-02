import 'babel-polyfill';

import Navigation from './components/Navigation';
import MainMenu from './components/MainMenu';
import Breadcrumbs from './components/Breadcrumbs';
import Document from './components/Document';
import Award from './components/Award';
import GalleryItem from './components/GalleryItem';
import AlbumCollection from './components/AlbumCollection';
import TeacherProfile from './components/TeacherProfile';
import Timeline from './components/Timeline';
import TimelineRecord from './components/TimelineRecord';
import TimelineRecordPost from './components/TimelineRecordPost';
import TimelineRecordInstagram from './components/TimelineRecordInstagram';
import Schedule from './components/Schedule';
import ScheduleTable from './components/ScheduleTable';
import ScheduleSlider from './components/ScheduleSlider';
import ScheduleSlide from './components/ScheduleSlide';
import ScheduleRecord from './components/ScheduleRecord';
import FooterLinks from './components/FooterLinks';
import EventPost from './components/EventPost';
import Album from './components/Album';
import Parallax from './components/Parallax';

import PageSchool from './components/PageSchool';
import PageEvents from './components/PageEvents';
import PageEvent from './components/PageEvent';
import PageSchedule from './components/PageSchedule';
import PageCollective from './components/PageCollective';
import PageTeacher from './components/PageTeacher';
import PageGallery from './components/PageGallery';
import PageAlbum from './components/PageAlbum';
import PageDocuments from './components/PageDocuments';

import AppController from './controllers/AppController';
import CopyrightController from './controllers/CopyrightController';
import ContactsController from './controllers/ContactsController';

import RemoveHashtags from './filters/RemoveHashtags';
import RemoveNewline from './filters/RemoveNewline';
import Strip from './filters/Strip';
import Join from './filters/Join';
import UppercaseFirst from './filters/UppercaseFirst';
import Bytes from './filters/Bytes';
import Ext from './filters/Ext';

import IOService from './services/io';
import MenuService from './services/menu';
import API from './services/api';

import {collectiveSortPattern} from './config';

let app = angular.module('hudozka', [
    'ngRoute',
    'angulartics',
    'angulartics.google.analytics',
    'angularSpinner'
]);

app.config(($locationProvider, $routeProvider) => {
    $locationProvider.hashPrefix('!');
    $locationProvider.html5Mode(true);

    let routers = [
        {
            name: '/',
            template: '<page-school></page-school>',
            title: 'ДХШ Шлиссельбурга'
        },
        {
            name: '/events/:page?/:pageNumber?',
            template: '<page-events events="$resolve.posts"></page-events>',
            title: 'События Школы',

            resolve: {
                posts: api => api.event
                    .list()
                    .then(i => i.data)
            }
        },
        {
            name: '/event/:event',
            template: '<page-event></page-event>'
        },
        {
            name: '/schedule/:period?/:semester?',
            template: '<page-schedule schedules="$resolve.list"></page-schedule>',
            title: 'Расписание',
            resolve: {
                list: api => api.schedule
                    .list()
                    .then(i => i.data)
            }
        },
        {
            name: '/collective',
            template: '<page-collective members="$resolve.list"></page-collective>',
            title: 'Преподаватели',
            resolve: {
                list: api => api.teacher
                    .list(collectiveSortPattern)
                    .then(i => i.data)
            }
        },
        {
            name: '/teacher/:id',
            template: '<page-teacher member="$resolve.profile"></page-teacher>',
            title: 'Преподаватели',
            resolve: {
                profile: ($route, api) => {
                    let id = $route.current.params.id;
                    return api.teacher
                        .fetch(id)
                        .then(i => i.data);
                }
            }
        },
        {
            name: '/gallery',
            template: '<page-gallery albums="$resolve.list"></page-gallery>',
            title: 'Работы учащихся',
            resolve: {
                list: api => api.album
                    .list()
                    .then(i => i.data)
            }
        },
        {
            name: '/album/:id',
            template: '<page-album album="$resolve.album"></page-album>',
            resolve: {
                album: ($route, api) => {
                    let id = $route.current.params.id;

                    return api.album
                        .fetch(id)
                        .then(i => i.data)
                }
            }
        },
        {
            name: '/documents',
            template: '<page-documents awards="$resolve.awards" documents="$resolve.documents"></page-documents>',
            title: 'Документы',
            resolve: {
                awards: api => api.document
                    .awards()
                    .then(i => i.data),

                documents: api => api.document
                    .documents()
                    .then(i => i.data)
            }
        }
    ]
        .map(i => {
            let path = i.name;
            delete i.name;
            return {
                path: path,
                route: i
            }
        });

    routers.forEach(i => {
        $routeProvider.when(i.path, i.route);
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
    API,
    IOService,
    MenuService,
    RemoveHashtags,
    RemoveNewline,
    Strip,
    Join,
    UppercaseFirst,
    Bytes,
    Ext,
    MainMenu,
    Navigation,
    Breadcrumbs,
    Timeline,
    TimelineRecord,
    TimelineRecordPost,
    TimelineRecordInstagram,
    EventPost,
    Album,
    Parallax,
    Document,
    Award,
    GalleryItem,
    AlbumCollection,
    TeacherProfile,
    PageSchool,
    PageEvent,
    PageEvents,
    PageSchedule,
    PageCollective,
    PageTeacher,
    PageGallery,
    PageAlbum,
    PageDocuments,
    AppController,
    CopyrightController,
    ContactsController,
    Schedule,
    ScheduleTable,
    ScheduleSlider,
    ScheduleSlide,
    ScheduleRecord,
    FooterLinks
].map(i => i(app));
