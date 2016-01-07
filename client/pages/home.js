/**
 * Created by tmshv on 22/11/14.
 */

module.exports = function (app) {
    app.controller('HomePageController', function ($scope, config) {
        var fotorama;

        $scope.pageClass = 'page-home';

        var $tape = $('.tape-block');
        var $fotorama = $tape.find('.tape-block__content');

        $tape.addClass('simplified');
        $fotorama.on('fotorama:ready', function () {
            $tape.removeClass('simplified');
            fotorama.setOptions({
                nav: 'dots',
                transition: 'crossfade',
                autoplay: '6000',
                arrows: 'false',
                width: '100%',
                fit: 'cover',
                loop: 'true'
            });
        });

        fotorama = $fotorama.fotorama().data('fotorama');

        setTimeout(function(){
            fotorama.load([
                {img: 'https://static.shburg.org/art/img/cat1.jpg'},
                {img: 'https://static.shburg.org/art/img/cat2.jpg'},
                {img: 'https://static.shburg.org/art/img/cat3.jpg'}
            ]);
        }, 100);
    });
};