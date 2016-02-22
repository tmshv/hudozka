import template from '../../templates/components/timeline-record-instagram.html';

export default function (app) {
    app.component('timelineRecordInstagram', {
        bindings: {
            post: '<'
        },
        template: template
    });
};