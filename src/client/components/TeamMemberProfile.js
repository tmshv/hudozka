import template from '../../templates/components/team-member-profile.html';

export default function (app) {
    app.component('teamMemberProfile', {
        bindings: {
            member: '='
        },
        template: template
    });
};
