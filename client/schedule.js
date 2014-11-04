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
    
    var now = new Date();
    var day = now.getDay();
    // day = 3;
    if(day == 0) deselectDays();
    else selectDay(day);
    
    var dates = getDates(day);
    $(".schedule thead .date").each(function(index, elem){
        $(elem).text(dates[index]);
    });
    
    function selectDay(day){
        deselectDays();
    //    day = Math.min(1, day);
    //    day = Math.max(6, day);

        $($(".schedule thead th")[day]).addClass("current first");
        $(".schedule tbody tr").each(function(index, elem){
            $($(elem).find("td")[day]).addClass("current");
        });
        $($(".schedule tbody tr").last().find("td")[day]).addClass("last");
    }

    function deselectDays(){
        $(".schedule thead th").removeClass("current first");
        $(".schedule tbody td").removeClass("current last");
    }
});

/**
 * Generates list of numbers
 * @param  {Number} start starting value
 * @param  {Number} num   amount of numbers in list
 * @param  {Number} step  difference value
 * @return {Array}        list of numbers
 */
function range(start, num, step){
    var list= [];
    var val = start;
    for(var i = 0; i<num; i++){
        list.push(val);
        val += step;
    }
    return list;
}

/**
 * Monday date of current week
 * @param  {[type]} d [description]
 * @return {[type]}   [description]
 */
function getMonday(d) {
    d = new Date(d);
    var day = d.getDay();
    var diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    return new Date(d.setDate(diff));
}

function getDates(day){
    var dates = [];
    var prev = day == 0 ? 0 : day - 1;
    var next = 6 - prev;
    var dayMask = range(-1, prev, -1).concat([0]).concat(range(1, next, 1));
    console.log("day mask", dayMask);
    dayMask.forEach(function(m){
        var time = Date.now() + (1000 * 60 * 60 * 24) * m;
        var date = new Date(time);
        console.log(date);
        dates.push(date.getDate());
    });
    return dates;
}