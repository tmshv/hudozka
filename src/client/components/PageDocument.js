import template from '../../templates/components/page-document.html';
import {unique} from '../../utils/common';

export default function (app) {
    app.component('pageDocument', {
        bindings: {
            item: '<'
        },
        template: template,
        controllerAs: '$'
    });
};