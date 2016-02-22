import template from '../../templates/components/schedule.html';

export default function(app) {
    app.component('schedule', {
        bindings: {
            schedule: '<'
        },
        template: template,
        controller: function () {
            this.type = 'table';

            try {
                if (window.matchMedia('(max-device-width: 30em)').matches) {
                    this.type = 'slider';
                }
            } catch (e) {
            }
        }
    });
};