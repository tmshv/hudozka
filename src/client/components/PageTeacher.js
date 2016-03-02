import template from '../../templates/components/page-teacher.html';

export default function (app) {
    app.component('pageTeacher', {
        bindings:{
            member: '<'
        },
        template: template,
        controllerAs: '$',
        controller: function(menu){
            menu.activate('/collective');
        }
    });
};