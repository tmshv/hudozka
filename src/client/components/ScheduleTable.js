import template from '../../templates/components/schedule-table.html';
import {getDates} from '../../utils/date';

export default function(app) {
    app.component('scheduleTable', {
        bindings: {
            schedule: '<'
        },
        template: template,
        controller: function () {
            const now = new Date();
            const dates = getDates(now);

            this.isToday = weekDayIndex => (now.getDay() - 1) === weekDayIndex;
            this.weekDay = weekDayIndex => dates[weekDayIndex];

            //var $tbody = element.find('table tbody');
            //var $thead = element.find('table thead');

            //let setHeadWidth = () => {
            //    var $td_list = element.find('table tbody tr:first-child td');
            //    $td_list.each(function (i) {
            //        var w = this.offsetWidth;
            //        $thead.find('th')[i].style.width = `${w}px`;
            //    });
            //};

            //let resetHeadWidth = () => {
            //    var $td_list = element.find('table tbody tr:first-child td');
            //    $td_list.each(function (i) {
            //        var w = this.offsetWidth;
            //        $thead.find('th')[i].style.width = null;
            //    });
            //};

            //var min;
            //var max;
            //$(window).scroll(function () {
            //    const scrollOffset = 150;
            //    if(!min) min = element.find('table tbody tr:first-child')[0].offsetTop + scrollOffset;
            //    if(!max) max = element.find('table tbody tr:last-child')[0].offsetTop + scrollOffset;
            //
            //    var scroll = $(this).scrollTop();
            //    if (scroll >= min && scroll <= max) {
            //        setHeadWidth();
            //        $thead.addClass('fix animated fadeInDown');
            //        $tbody.addClass('fix');
            //    } else {
            //        resetHeadWidth();
            //        $thead.removeClass('fix animated fadeInDown');
            //        $tbody.removeClass('fix');
            //    }
            //});
        }
    });
};