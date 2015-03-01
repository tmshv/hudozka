var app = angular.module("hudozhka.document", [
    "hudozhka.data",
    "angulartics",
    "angulartics.google.analytics"
]);

app.factory("docname", function ($location) {
    return function(){
        var abs = $location.absUrl();
        var doc_uri = /\/([\w-]+)$/.exec(abs);
        if(doc_uri.length >= 2) {
            return doc_uri[1];
        }else{
            return null;
        }
    }
});

app.controller("DocumentController", function ($rootScope, $scope, docs, docname) {
    $scope.pageClass = "page-document";

    var n = docname();
    if(n) {
        var d = docs.doc(n);
        $scope.document = d;
        $rootScope.title = d.title;
    }
});

require("./filters/uppercase-first")(app);