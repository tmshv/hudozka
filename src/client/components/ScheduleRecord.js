import template from '../../templates/components/schedule-record.html';

export default function(app) {
    app.component('scheduleRecord', {
        bindings: {
            record: '<',
            i: '<'
        },
        template: template
    })
};
