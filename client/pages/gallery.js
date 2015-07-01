module.exports = function (app) {
    app.directive("gFotorama", function(){
        return {
            restrict: "A",
            link: function(scope, element, attrs){
                element.addClass('fotorama');
                var fotorama = $(element.fotorama()).data('fotorama');
                fotorama.setOptions({
                    width: "100%",
                    maxheight: 500,
                    loop: true,
                    nav: "thumbs"
                });

                scope.$watch(attrs.gFotorama, function (value){
                    console.log(value);
                    fotorama.load(value);
                });
            }
        }
    });

    app.controller("GalleryPageController", function ($scope, $http) {
        $http.get("/gallery")
            .success(function (albums) {
                $scope.albums = albums.map(function (album) {
                    var preview = album.content[0];
                    album.preview_url = preview.content.medium.url;
                    album.fotorama = album.content.map(productToFotorama);

                    return album;
                });
            });
    });

    app.controller("AlbumPageController", function ($scope, $http, $routeParams) {
        var url = '/gallery/{year}/{course}/{album}'
            .replace('{year}', $routeParams.year)
            .replace('{course}', $routeParams.course)
            .replace('{album}', $routeParams.album);
        $http.get(url)
            .success(function (album) {
                var preview = album.content[0];
                album.preview_url = preview.content.medium.url;
                album.fotorama = album.content.map(productToFotorama);

                $scope.album = album;
            });
    });
};

function productToFotorama(product) {
    return {
        img: product.content["big"].url,
        thumb: product.content["small"].url,
        full: product.content["original"].url
    }
}