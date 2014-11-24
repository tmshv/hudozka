var app = angular.module("document.hudozhka", ["ngRoute", "data.hudozhka"]);

app.config(function ($locationProvider, $sceDelegateProvider, $routeProvider) {
    $locationProvider.html5Mode(true);
    //$routeProvider
    //    .when("/document/:doc", {
    //        controller: "DocumentPageController"
    //    })
    //    .otherwise({
    //        redirectTo: "/"
    //    });

    $sceDelegateProvider.resourceUrlWhitelist([
        "self",
        "http://static.shburg.org/**",
        "http://static.shlisselburg.org/**"
    ]);
});

//app.factory("document", function () {
//    var document;
//    return {
//        init:function(doc) {
//            document = doc;
//        },
//
//        document: document
//    };
//});

app.controller("DocumentPageController", function ($scope) {
    $scope.pageClass = "page-document";
});

require("./ui/pdf")(app);
require("./ui/doc-controller")(app);
