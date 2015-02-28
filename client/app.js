/**
 * Created by tmshv on 04/11/14.
 */

var app = angular.module("hudozhka", [
    "ngRoute", "data.hudozhka",
    "angulartics", "angulartics.google.analytics",
]);

app.config(function ($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);

    var routes = [
        {
            name: "/",
            templateUrl: "/views/home.html",
            controller: "HomePageController"
        },
        {
            name: "/schedule",
            templateUrl: "/views/schedule.html",
            controller: "SchedulePageController"
        },
        {
            name: "/team",
            templateUrl: "/views/team.html",
            controller: "TeamPageController"
        },
        {
            name: "/docs",
            templateUrl: "/views/docs.html",
            controller: "DocsPageController"
        }
    ];

    routes.forEach(function (route) {
        $routeProvider.when(route.name, route);
    });

    $routeProvider.otherwise({
        redirectTo: "/"
    });
});

require("./api/api")(app);
require("./ui/menu")(app);
require("./ui/timeline")(app);
require("./filters/uppercase-first")(app);
require("./pages/home")(app);
require("./pages/schedule")(app);
require("./pages/team")(app);
require("./pages/docs")(app);

app.controller("SchedulePageController", function ($scope) {
    $scope.pageClass = "page-schedule";
});

app.controller("TeamPageController", function ($scope) {
    $scope.pageClass = "page-team";
});

app.controller("DocsPageController", function ($scope) {
    $scope.pageClass = "page-docs";
});