/**
 * Created by tmshv on 06/11/14.
 */

angular.module("hudozhka.data", [])
    .service("scheduleData", function () {
        return require("../models/schedule");
    })
    .service("docs", function () {
        return require("../models/document");
    });