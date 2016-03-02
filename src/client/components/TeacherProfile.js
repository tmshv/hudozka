import {splitName} from '../../models/collective';
import {stringToBoolean} from '../../utils/string';
import template from '../../templates/components/teacher-profile.html';

export default function (app) {
    app.component('teacherProfile', {
        bindings: {
            profile: '<',
            showUrl: '@'
        },
        template: template,
        controllerAs: '$',
        controller: function($sce){
            this.url = this.showUrl === 'true';
            //this.showUrl = stringToBoolean(this.showUrl);

            const [_, first, middle, last] = splitName(this.profile.name);
            this.firstName = first;
            this.middleName = middle;
            this.lastName = last;

            if (this.profile.picture) {
                this.image = this.profile.picture.data.big;
            }

            this.biography = $sce.trustAsHtml(this.profile.biography);
        }
    });
};
