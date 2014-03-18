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
    if(day < 7) selectDay(day);
    else deselectDays();
    
   var dates = getDates(day);
    // var dates = [45, 53, 53, 23, 53, 64];
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

function range(start, num, step){
        var list= [];
        var val = start;
        for(var i = 0; i<num; i++){
            list.push(val);
            val += step;
        }
        return list;
    }

function getDates(day){
    var dates = [];
    var prev = day - 1;
    var next = 6 - day;
    var dayMask = range(-1, 1, -1).concat([0]).concat(range(1, next, 1));
    console.log("day mask", dayMask);
    dayMask.forEach(function(m){
        var time = Date.now() + (1000 * 60 * 60 * 24) * m;
        var date = new Date(time);
        console.log(date);
        dates.push(date.getDate());
    });
    return dates;
}