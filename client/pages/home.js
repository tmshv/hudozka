/**
 * Created by tmshv on 22/11/14.
 */

module.exports = function (app) {
    app.controller("HomePageController", function ($scope, config) {
        var fotorama;

        $scope.pageClass = "page-home";

        var $tape = $('.tape-block');
        var $fotorama = $('.fotorama');

        $tape.addClass('simplified');
        $fotorama.on('fotorama:ready', function () {
            $tape.removeClass('simplified');
            fotorama.setOptions({
                nav: 'dots'
            });
        });

        fotorama = $fotorama.fotorama().data('fotorama');
        fotorama.load([
            {img: 'http://static.shburg.org/art/img/cat1.jpg'},
            {img: 'http://static.shburg.org/art/img/cat2.jpg'},
            {img: 'http://static.shburg.org/art/img/cat3.jpg'}
        ]);
    });
};