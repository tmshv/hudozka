import template from '../../templates/components/schedule-slider.html';
import {getDates} from '../../utils/date';

function week(schedule) {
    let now = new Date();
    let dates = getDates(now);

    return ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
        .map((day, i) => {
            return {
                current: i === now.getDay() - 1,
                day: day,
                date: dates[i],
                groups: schedule.map(group => {
                    return {
                        name: group.name,
                        time: group.time,
                        content: group.days[i]
                    }
                })
            }
        });
}

export default function(app) {
    app.directive('scheduleSlider', ($compile) => {
        return {
            restrict: 'E',
            template: template,
            scope:{
                schedule: '='
            },
            link: function (scope, element) {
                let $slick = element.find('.schedule-slick');

                scope.$watch('schedule', value => {
                    try {
                        $slick.slick('unslick');
                    } catch (e) {

                    }

                    if (value) {
                        let days = week(value);
                        scope.days = days;

                        $slick.html(
                            days.map((day, i) => {
                                return `<schedule-slide day="days[${i}]"></schedule-slide>`
                            }).join('')
                        ).show();
                        $compile($slick.contents())(scope);

                        $slick.slick({
                            mobileFirst: true,
                            infinite: false,
                            dots: false,
                            arrows: false,
                            touchThreshold: 20,
                            speed: 250,
                            slidesToShow: 1,
                            centerMode: false
                        });

                        let now = new Date();
                        let currentWeekIndex = now.getDay() - 1;
                        $slick.slick('slickGoTo', currentWeekIndex);
                    }
                });
            }
        }
    });
};
