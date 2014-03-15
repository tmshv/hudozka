$(document).ready(function(){
    $(window).scroll(function(){
        if ($(window).scrollTop() >= 220) {
           $(".schedule table thead").addClass("fix animated fadeInDown");
           $(".schedule table tbody").addClass("fix");
        }else{
           $(".schedule table thead").removeClass("fix animated fadeInDown");
           $(".schedule table tbody").removeClass("fix");
        }
    });
});