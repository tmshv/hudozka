import template from '../../templates/components/page-album.html';

export default function (app) {
    app.component('pageAlbum', {
        bindings: {
            album: '<'
        },
        template: template,
        controllerAs: '$',
        controller: function ($rootScope,$sce, menu) {
            menu.activate('/gallery');

            this.post = $sce.trustAsHtml(this.album.post);

            //this.crumbs = [
            //    {
            //        url: '/gallery',
            //        name: 'Галерея'
            //    },
            //    {
            //        name: 1010
            //    },
            //    {
            //        name: album.title
            //    }
            //];

            $rootScope.title = this.album.title;
        }
    });
};