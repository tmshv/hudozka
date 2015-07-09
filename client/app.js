/**
 * Created by tmshv on 04/11/14.
 */

var app = angular.module("hudozhka", [
    "hudozhka.data",
    "ngRoute",
    "angulartics",
    "angulartics.google.analytics",
    "angularSpinner"
]);

app.config(function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix("!");
    $locationProvider.html5Mode(true);

    var routes = [
        {
            name: "/",
            templateUrl: "/views/home.html",
            controller: "HomePageController",
            title:"ДХШ Шлиссельбурга"
        },
        {
            name: "/schedule",
            templateUrl: "/views/schedule.html",
            controller: "SchedulePageController",
            title:"Расписание"
        },
        {
            name: "/team",
            templateUrl: "/views/team.html",
            controller: "TeamPageController",
            title:"Преподаватели"
        },
        {
            name: "/gallery",
            templateUrl: "/views/gallery.html",
            controller: "GalleryPageController",
            title:"Работы учащихся"
        },
        {
            name: "/gallery/:year/:course/:album",
            templateUrl: "/views/gallery-album.html",
            controller: "AlbumPageController",
            title:"Работы учащихся"
        },
        {
            name: "/docs",
            templateUrl: "/views/docs.html",
            controller: "DocsPageController",
            title: "Документы"
        }
    ];

    routes.forEach(function (route) {
        $routeProvider.when(route.name, route);
    });

    $routeProvider.otherwise({
        templateUrl: "/404.html"
    });
});

app.run(function($location, $rootScope, $http) {
    $rootScope.$on("$routeChangeSuccess", function (event, current) {
        $rootScope.title = current["$$route"].title;
    });

    $http.defaults.headers.common["Accept"] = "application/json";
});

require("./api/api")(app);
require("./services/io")(app);
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

app.controller("TeamPageController", function ($scope) {
    $scope.pageClass = "page-team";
});

app.controller("DocsPageController", function ($scope) {
    $scope.pageClass = "page-docs";
});