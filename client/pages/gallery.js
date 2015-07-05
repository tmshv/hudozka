module.exports = function (app) {
    app.directive("gFotorama", function () {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                element.addClass('fotorama');
                var fotorama = $(element.fotorama()).data('fotorama');
                fotorama.setOptions({
                    width: "100%",
                    maxheight: 500,
                    loop: true,
                    nav: "thumbs"
                });

                scope.$watch(attrs.gFotorama, function (value) {
                    console.log(value);
                    fotorama.load(value);
                });
            }
        }
    });

    app.controller("GalleryPageController", function ($scope, $http) {
            $scope.years = [];
            var years = [2015, 2014, 2013, 2012, 2011, 2010];
            years.forEach(function (year, year_index) {
                $http.get("/gallery/" + year)
                    .success(function (albums) {
                        if(albums.length) {
                            $scope.years[year_index] = {
                                year: year,
                                albums: albums.map(function (album) {
                                    var preview = album.content[0];
                                    album.preview_url = preview.content.medium.url;
                                    album.fotorama = album.content.map(productToFotorama);

                                    return album;
                                })
                            };
                        }
                    })
            });
            //$http.get("/gallery")
            //    .success(function (albums) {
            //        $scope.albums = albums.map(function (album) {
            //            var preview = album.content[0];
            //            album.preview_url = preview.content.medium.url;
            //            album.fotorama = album.content.map(productToFotorama);
            //
            //            return album;
            //        });
            //    });
        }
    );

    app.controller("AlbumPageController", function ($scope, $http, $routeParams) {
        var url = '/album/{year}/{course}/{album}'
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
}
;

function productToFotorama(product) {
    return {
        img: product.content["big"].url,
        thumb: product.content["small"].url,
        full: product.content["original"].url
    }
}