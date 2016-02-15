/**
 * Created by tmshv on 04/11/14.
 */

var deps = [
    require('./modules/schedule')
].map(m => m.name);

var app = angular.module("hudozhka", deps.concat([
    "hudozhka.data",
    "ngRoute",
    "angulartics",
    "angulartics.google.analytics",
    "angularSpinner"
]));

app.config(function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix("!");
    $locationProvider.html5Mode(true);

    var routes = [
        {
            name: "/",
            templateUrl: "/views/home.html",
            controller: "HomePageController",
            title: "ДХШ Шлиссельбурга"
        },
        {
            name: "/schedule/:period?/:semester?",
            templateUrl: "/views/schedule.html",
            controller: "SchedulePageController",
            title: "Расписание"
        },
        {
            name: "/team",
            templateUrl: "/views/team.html",
            controller: "TeamPageController",
            title: "Преподаватели"
        },
        {
            name: "/gallery",
            templateUrl: "/views/gallery.html",
            controller: "GalleryPageController",
            title: "Работы учащихся"
        },
        {
            name: "/gallery/:year/:course/:album",
            templateUrl: "/views/gallery-album.html",
            controller: "AlbumPageController"
        },
        {
            name: "/docs",
            templateUrl: "/views/docs.html",
            controller: "DocsPageController",
            title: "Документы"
        }
    ];

    routes.forEach(function (route) {
        if (typeof route === 'function') route = route();
        $routeProvider.when(route.name, route);
    });

    $routeProvider.otherwise({
        templateUrl: "/404.html"
    });
});

app.run(function ($location, $rootScope, $http) {
    $rootScope.$on("$routeChangeSuccess", function (event, current) {
        var title = current["$$route"].title;
        if (title) $rootScope.title = title;
    });

    $http.defaults.headers.common["Accept"] = "application/json";
});

require("./api/api")(app);
require("./services/io")(app);
require("./directives/mainMenu")(app);
require("./directives/teamMemberProfile")(app);
require("./directives/backgroundPicture")(app);
require("./ui/menu")(app);
require("./ui/breadcrumbs")(app);
require("./ui/timeline")(app);
require("./filters/strip")(app);
require("./filters/remove-hashtags")(app);
require("./filters/removeNewline")(app);
require("./filters/uppercase-first")(app);
require("./pages/home")(app);
require("./pages/schedule")(app);
require("./pages/team")(app);
require("./pages/gallery")(app);
require("./pages/docs")(app);
require("./controllers/ContactsController")(app);
require("./controllers/CopyrightController")(app);

app.controller("SchedulePageController", function ($scope) {
    $scope.pageClass = "page-schedule";
});

app.controller("DocsPageController", function ($scope) {
    $scope.pageClass = "page-docs";
});

app.controller("AppController", function ($scope, menu) {
    $scope.menuProvider = menu.items;
});