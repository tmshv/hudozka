/**
 * Created by tmshv on 06/11/14.
 */

angular.module("data.hudozhka", [])
    .service("team", function () {
        return require("../models/team");
    })
    .service("schedule", function () {
        return require("../models/schedule");
    })
    .service("docs", function () {
        return require("../models/document");
    });