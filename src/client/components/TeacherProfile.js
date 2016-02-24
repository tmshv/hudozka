import template from '../../templates/components/teacher-profile.html';

export default function (app) {
    app.component('teacherProfile', {
        bindings: {
            member: '='
        },
        template: template
    });
};
