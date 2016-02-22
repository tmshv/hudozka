import template from '../../templates/components/timeline-record.html';

export default function (app) {
    app.component('timelineRecord', {
        bindings: {
            post: '<',
            type: '@'
        },
        template: template
    });
};