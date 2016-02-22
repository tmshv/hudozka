import template from '../../templates/components/schedule-slide.html';

export default function(app) {
    app.component('scheduleSlide', {
        bindings: {
            day: '<'
        },
        template: template
    })
};