import template from '../../templates/components/schedule.html';
import {mobileMatchSelector} from '../config';

export default function(app) {
    app.component('schedule', {
        bindings: {
            schedule: '<'
        },
        template: template,
        controller: function () {
            this.type = 'table';

            try {
                if (window.matchMedia(mobileMatchSelector).matches) {
                    this.type = 'slider';
                }
            } catch (e) {
            }
        }
    });
};
