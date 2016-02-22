export default function (app) {
    app.controller('AlbumController', ($scope, $rootScope, $http, $routeParams, team, api, menu) => {
        menu.activate('/gallery');

        let year_uri = $routeParams.year;
        let course_uri = $routeParams.course;
        let album_uri = $routeParams.album;

        api.gallery.album(year_uri, course_uri, album_uri)
            .success(album => {
                album.teacherName = team.name(album['teacher']);

                $scope.album = album;
                $scope.crumbs = [
                    {
                        url: '/gallery',
                        name: 'Галерея'
                    },
                    {
                        name: year_uri
                    },
                    {
                        name: album.course
                    },
                    {
                        name: album.title
                    }
                ];
                $rootScope.title = album.title;
            });
    });
};
