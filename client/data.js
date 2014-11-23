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
    })
    .service("config", function(){
        return {
            telephone: "8 (81362) 77-502"
        };
    });