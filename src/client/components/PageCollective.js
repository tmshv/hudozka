import template from '../../templates/components/page-collective.html';

export default function (app) {
    app.component('pageCollective', {
        bindings:{
            members: '<'
        },
        template: template,
        controller: function() {
            //api.collective.list(collectiveSortPattern)
            //    .success(collective => {
            //        this.members = collective;
            //    });

            //let rangelen = r => r[1] - r[0];
            //let interpolate = (r, i) => (i - r[0]) / rangelen(r);
            //let extrapolate = (r, i) => r[0] + rangelen(r) * i;
            //
            //let mapValue = (from, to) =>
            //    i => extrapolate(
            //        to, interpolate(
            //            from, i
            //        ));
            //
            //let mapImageScroll = mapValue([0, 400], [0, -100]);
            //
            //$(window).scroll(() => {
            //    let scroll = $(window).scrollTop();
            //
            //    let v = mapImageScroll(scroll);
            //    console.log(v);
            //
            //    this.$apply(() => {
            //        this.imageStyle = {
            //            top: v
            //        };
            //    });
            //});
        }
    });
};