import template from '../../templates/components/timeline-record-post.html';

export default function (app) {
    app.component('timelineRecordPost', {
        bindings: {
            post: '<'
        },
        template: template,
        controller: function($sce){
            this.message = $sce.trustAsHtml(this.post.message);
        }
    });
};