import {splitName} from '../../models/collective';
import template from '../../templates/components/teacher-profile.html';

export default function (app) {
    app.component('teacherProfile', {
        bindings: {
            member: '='
        },
        template: template,
        controller: function($sce){
            let [first, middle, last] = splitName(this.member.name);
            this.firstName = first;
            this.middleName = middle;
            this.lastName = last;

            if (this.member.picture) this.image = this.member.picture.big.url;
            this.biography = $sce.trustAsHtml(this.member.biography);
        }
    });
};
