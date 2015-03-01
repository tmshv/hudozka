/**
 * Created by tmshv on 24/11/14.
 */

module.exports = function (app) {
    app.controller("DocumentController", function ($scope, $location, docs) {
        $scope.showControls = false;

        var doc_uri = $location.$$path.replace("/document/", "");
        $scope.document = docs.doc(doc_uri);
        $scope.document.currentPage = 0;

        $scope.viewDocument = function () {
            return "/views/document-image.html";
            switch ($scope.document.viewer) {
                case "img-sheet":
                    $scope.showControls = false;
                    return "/views/document-image.html";

                default:
                    $scope.showControls = true;
                    return "/views/document-paper.html";
            }
        };

        $scope.totalPages = $scope.document.url.length;
        $scope.currentPage = 1;

        $scope.prevPage = function () {
            var i = $scope.currentPage - 1;
            if (i > 0) {
                $scope.currentPage = i;
                $scope.document.currentPage = i - 1;
            }
        };

        $scope.nextPage = function () {
            var i = $scope.currentPage + 1;
            if (i <= $scope.totalPages) {
                $scope.currentPage = i;
                $scope.document.currentPage = i - 1;
            }
        };

        $scope.update = function () {
            var i = $scope.currentPage;
            if (i > 0 && i <= $scope.totalPages) {
                $scope.currentPage = i;
                $scope.document.currentPage = i - 1;
            }
        };
    });
};