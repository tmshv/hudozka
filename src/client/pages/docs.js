module.exports = function (app) {
    app.controller("DocumentsController", function ($scope, api, docs) {
        $scope.documents = docs.docs;

        api.document.awards()
            .success(data => {
                $scope.awards = data;
            });
    });
};

/**
 * Generates list of numbers
 * @param  {Number} start starting value
 * @param  {Number} num   amount of numbers in list
 * @param  {Number} step  difference value
 * @return {Array}        list of numbers
 */
function range(start, num, step) {
    var list = [];
    var val = start;
    for (var i = 0; i < num; i++) {
        list.push(val);
        val += step;
    }
    return list;
}

///**
// * Monday date of current week
// * @param  {[type]} d [description]
// * @return {[type]}   [description]
// */
//function getMonday(d) {
//    d = new Date(d);
//    var day = d.getDay();
//    var diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
//    return new Date(d.setDate(diff));
//}

function getDates(day) {
    var dates = [];
    var prev = day == 0 ? 0 : day - 1;
    var next = 6 - prev;
    var dayMask = range(-1, prev, -1).concat([0]).concat(range(1, next, 1));

    dayMask.forEach(function (m) {
        var time = Date.now() + (1000 * 60 * 60 * 24) * m;
        var date = new Date(time);
        dates.push(date.getDate());
    });
    return dates;
}