export let collectiveSortPattern = [
    'mg-timasheva',
    'va-sarzhin',
    'od-gogoleva',
    'my-valkova',
    'vv-voronova',
    'nv-andreeva'
];

export let routes = [
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
        name: '/collective',
        templateUrl: '/views/collective.html',
        controller: 'CollectivePageController',
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
        name: '/documents',
        templateUrl: '/views/docs.html',
        controller: 'DocsPageController',
        title: 'Документы'
    }
];