import template from '../../templates/components/album.html';

export class AlbumController {
    constructor($sce) {
        if(this.album){
            //this.post = $sce.trustAsHtml(this.album.post);
        }
    }
}

export default function (app) {
    app.component('album', {
        bindings: {
            //album: '<'
            title: '@'
        },
        transclude: true,
        template: template,
        controllerAs: '$',
        //controller: function ($sce) {
        //    if(this.album){
        //        this.post = $sce.trustAsHtml(this.album.post);
        //    }
        //}
    });
};