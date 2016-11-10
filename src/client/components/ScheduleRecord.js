import template from '../../templates/components/schedule-record.html';
import {shortName} from '../../models/collective';
import {nullSafe} from "../../utils/common";

export default function(app) {
    app.component('scheduleRecord', {
        bindings: {
            record: '<',
            i: '<'
        },
        template: template,
        controller: function() {
            this.short = nullSafe(shortName);
        }
    })
};
