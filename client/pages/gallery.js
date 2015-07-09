module.exports = function (app) {
    app.directive("gFotorama", function () {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                element.addClass('fotorama');
                var $fotorama = $(element.fotorama());
                var fotorama = $fotorama.data('fotorama');
                fotorama.setOptions({
                    width: "100%",
                    maxheight: 500,
                    loop: true,
                    nav: "thumbs"
                });

                //$fotorama.on('fotorama:show', function (e, fotorama, extra) {
                $fotorama.on('fotorama:error', function (e, fotorama, extra) {
                    console.log('## ' + e.type);
                    console.log('active frame', fotorama.activeFrame);
                    console.log('additional data', extra);
                });

                scope.$watch(attrs.gFotorama, function (value) {
                    console.log(value);
                    fotorama.load(value);
                });
            }
        }
    });

    app.controller("GalleryPageController", function ($scope, api) {
            $scope.years = [];
            var years = [2015, 2014, 2013, 2012, 2011, 2010];
            years.forEach(function (year, year_index) {
                api.gallery.year(year)
                    .success(function (albums) {
                        if (albums.length) {
                            $scope.years[year_index] = {
                                year: year,
                                albums: albums.map(function (album) {
                                    var preview = album.content[0];
                                    album.preview_url = preview.content.medium.url;
                                    //album.fotorama = album.content.map(productToFotorama);

                                    return album;
                                })
                            };
                        }
                    })
            });
        }
    );

    app.controller("AlbumPageController", function ($scope, $http, $routeParams, api, menu) {
        menu.activate('/gallery');

        var year_uri = $routeParams.year;
        var course_uri = $routeParams.course;
        var album_uri = $routeParams.album;
        api.gallery.album(
            year_uri,
            course_uri,
            album_uri
        )
            .success(function (album) {
                //var preview = album.content[0];
                //album.preview_url = preview.content.medium.url;
                //album.fotorama = album.content.map(productToFotorama);

                $scope.album = album;
                $scope.crumbs = [
                    {
                        url: '/gallery',
                        name: 'Галерея'
                    },
                    {
                        url: '/gallery/{year}'.replace('{year}', year_uri),
                        name: year_uri
                    },
                    {
                        url: '/gallery/{year}/{course}'
                            .replace('{year}', year_uri)
                            .replace('{course}', course_uri),
                        name: album.course
                    },
                    {
                        name: album.title
                    }
                ];
            });
    });
};

function productToFotorama(product) {
    //var tpl =  '<div class="album-item"><div><p>' + product.author + '</p><p>' + product.authorAge  + ' лет</p></div></div>';

    var $e = $('<div class="album-item"><div></div></div>');
    var $c = $e.find('.album-item div');
    $('<p></p>').text(product.author).appendTo($c);
    if (product['authorAge']) {
        $('<p></p>').text(product['authorAge'] + ' лет').appendTo($c);
    }

    return {
        img: product.content["big"].url,
        thumb: product.content["small"].url,
        full: product.content["original"].url,
        //html: $.parseHTML(tpl)[0]
        html: $e
    };
}