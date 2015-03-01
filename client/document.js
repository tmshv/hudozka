var app = angular.module("hudozhka.document", [
    "hudozhka.data",
    "angulartics",
    "angulartics.google.analytics"
]);

app.controller("DocumentController", function ($scope, $location, docs) {
    $scope.pageClass = "page-document";
    $scope.showControls = false;

    var abs = $location.absUrl();
    var doc_uri = /\/([\w-]+)$/.exec(abs);

    if(doc_uri.length >= 2) {
        $scope.document = docs.doc(doc_uri[1]);
    }
});