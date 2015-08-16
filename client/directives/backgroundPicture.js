module.exports = function (app) {
    app.directive('backgroundPicture', function () {
        return {
            restrict: 'E',
            template: '<div class="background-picture" />',
            scope: {
                src: '='
            },
            link: function($scope, $element){
                var element = $element.find('.background-picture').get(0);
                element.style.backgroundImage = `url('${$scope.src}')`;

                setTimeout(function () {
                    var w = element.offsetWidth;
                    var h = element.offsetHeight;

                    if (w > h) {
                        element.classList.add('horizontal');
                    } else {
                        element.classList.add('vertical');
                    }
                }, 100);
            }
        }
    });
};