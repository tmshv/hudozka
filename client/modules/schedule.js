var getDates = require('../../utils/date').getDates;

module.exports = angular.module('hudozka.schedule', [])
    .directive('schedule', function($compile){
        return {
            restrict: 'E',
            scope: {
                groups: '='
            },
            link: function (scope, element) {
                var template = `<schedule-table groups="${scope.groups}"></schedule-table>`;

                try {
                    if (window.matchMedia('(max-device-width: 30em)').matches) {
                        template = `<schedule-slider groups="${scope.groups}"></schedule-slider>`
                    }
                } catch (e) {
                }

                element.html(template).show();
                $compile(element.contents())(scope);
            }
        };
    })
    .directive('scheduleTable', function(){
        return {
            templateUrl: '/views/schedule/table.html',
            link: function(scope, element){
                var now = new Date();
                var dates = getDates(now);

                scope.isToday = function (weekDayIndex) {
                    return (now.getDay() - 1) === weekDayIndex;
                };

                scope.weekDay = function (weekDayIndex) {
                    return dates[weekDayIndex];
                };

                var $tbody = element.find('table tbody');
                var $thead = element.find('table thead');

                $(window).scroll(function () {
                    if ($(this).scrollTop() >= 220) {
                        $thead.addClass('fix animated fadeInDown');
                        $tbody.addClass('fix');
                    } else {
                        $thead.removeClass('fix animated fadeInDown');
                        $tbody.removeClass('fix');
                    }
                });
            }
        }
    })
    .directive('scheduleSlider', function ($compile) {
        return {
            restrict: 'E',
            template: '<div class="schedule-slick"></div>',

            link: function (scope, element) {
                var $slick = element.find('.schedule-slick');

                scope.$watch('groups', function (value) {
                    try {
                        $slick.slick('unslick');
                    } catch (e) {

                    }

                    if (value) {
                        var days = week(value);
                        scope.days = days;

                        $slick.html(
                            days.map(function (day, i) {
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

                        var now = new Date();
                        var currentWeekIndex = now.getDay() - 1;
                        $slick.slick('slickGoTo', currentWeekIndex);
                    }
                });
            }
        }
    })
    .directive('scheduleSlide', function () {
        return {
            restrict: 'E',
            templateUrl: "/views/schedule/slide.html",
            scope: {
                day: '='
            }
        }
    })
    .directive('scheduleRecord', function () {
        return {
            restrict: 'E',
            templateUrl: "/views/schedule/record.html",
            scope: {
                record: '=',
                i: '='
            }
        }
    });

function week(schedule) {
    var now = new Date();
    var dates = getDates(now);

    return ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
        .map(function (day, i) {
            return {
                current: i === now.getDay() - 1,
                day: day,
                date: dates[i],
                groups: schedule.map(function (group) {
                    return {
                        name: group.name,
                        time: group.time,
                        content: group.days[i]
                    }
                })
            }
        });
}