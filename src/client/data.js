/**
 * Created by tmshv on 06/11/14.
 */

angular.module("hudozhka.data", [])
    .service("scheduleData", function () {
        return require("../models/schedule");
    })
    .service("docs", function () {
        return require("../models/document");
    })
    .service("config", function(){
        return {
            telephone: "+7 (81362) 76-312",
            email: "hudozka@gmail.com",
            address: ["г. Шлиссельбург", "ул. 18 января", "д. 3"]
                .reduce(function(address, item){
                    return address + (address == '' ? '' : ' ') + item.replace(' ', String.fromCharCode(0xA0));
                }, '')
        };
    });