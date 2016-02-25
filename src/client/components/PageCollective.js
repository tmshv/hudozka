import template from '../../templates/components/page-collective.html';
import {collectiveSortPattern} from '../config';

export default function (app) {
    app.component('pageCollective', {
        template: template,
        controller: function(api) {
            this.pageClass = 'page-collective';

            api.collective.list(collectiveSortPattern)
                .success(collective => {
                    this.members = collective;
                });
        }
    });
};