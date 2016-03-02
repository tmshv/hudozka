import template from '../../templates/components/page-gallery.html';
import {branch} from '../../utils/common';

export default function (app) {
    let branchYears = branch(
        i => 'date' in i ? i.date.getFullYear() : 'XXXX'
    );

    app.component('pageGallery', {
        bindings: {
            albums: '<'
        },
        template: template,
        controllerAs: '$',
        controller: function () {
            this.pageClass = 'page-gallery';

            let years = branchYears(
                this.albums
                    .map(i => {
                        i['date'] = new Date(i['date']);
                        return i;
                    })
            );

            this.collections = Object
                .keys(years)
                .map(i => parseInt(i))
                .sort((a, b) => b - a)
                .map(i => {
                    return {
                        title: i,
                        albums: years[i]
                    }
                });
        }
    });
};