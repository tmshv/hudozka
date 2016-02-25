import template from '../../templates/components/page-gallery.html';

export default function (app) {
    app.component('pageGalleryAlbum', {
        template: template,
        controller: function ($rootScope, $routeParams, api, menu) {
            this.pageClass = 'page-gallery-album';

            menu.activate('/gallery');

            let year_uri = $routeParams.year;
            let course_uri = $routeParams.course;
            let album_uri = $routeParams.album;

            api.gallery.album(year_uri, course_uri, album_uri)
                .success(album => {
                    //album.teacherName = team.name(album['teacher']);
                    album.teacherName = album['teacher'];

                    this.album = album;
                    this.crumbs = [
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
        }
    });
};