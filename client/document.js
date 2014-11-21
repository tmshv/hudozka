var app = angular.module("document.hudozhka", ["ngRoute", "data.hudozhka"]);

app.config(function ($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);
    //$routeProvider
    //    .when("/document/:doc", {
    //        controller: "DocumentPageController"
    //    })
    //    .otherwise({
    //        redirectTo: "/"
    //    });
});

app.controller("DocumentPageController", function ($scope, $location, docs) {
    $scope.pageClass = "page-document";

    var doc = $location.$$path.replace("/document/", "");
    $scope.doc = docs.doc(doc);
});

//var Doc = (function(){
//    var Document = function(baseURL){
//        this.pages = [];
//        this.baseURL = baseURL;
//    }
//
//    Document.prototype.hasPage = function(index){
//        return index >= 0 && index < this.pages.length;
//    }
//
//    Document.prototype.getPageURL = function(pageNumber){
//        var s = pageNumber <2 ? "" : "/" + pageNumber;
//        return this.baseURL + s;
//    }
//
//    Document.prototype.page = function(index){
//        return index + 1;
//    }
//
//    return Document;
//})();
//
//(function(){
//    const PAGES = [];
//    var currentPageIndex = 0;
//    var doc = new Doc(location.pathname.replace(/\/\d+$/, ""));
//    $(document).ready(function(){
//        try{
//            var hrefPage = /\/(\d+)$/.exec(location.href)[1];
//            currentPageIndex = parseInt(hrefPage) - 1;
//        }catch(error){
//
//        }
//
//        $("#buttonNext").click(function(event){
//            loadNext();
//        });
//
//        $("#buttonPrev").click(function(event){
//            loadPrevious();
//        });
//
//        $("#page-container .pf").each(function(index, elem){
//            var url = $(elem).data("page-url");
//            doc.pages.push(url);
//        });
//
//        $("#currentPage").attr("max", doc.pages.length);
//        $("#totalPages").text(doc.pages.length);
//        $("#currentPage").change(function(){
//            var i = parseInt($(this).val()) - 1;
//            if(i && doc.hasPage(i)){
//                loadPage(i);
//            }
//        });
//
//        $("#page-container").html("");
//        loadPage(currentPageIndex);
//
//        window.addEventListener("popstate", function(event){
//            console.log("pops");
//            console.log(event);
//            var i = event.state;
//            loadPage(i);
//        });
//    });
//
//    function loadNext(){
//        var i = currentPageIndex + 1;
//        if(doc.hasPage(i)){
//            loadPage(i);
//        }else{
//
//        }
//    }
//
//    function loadPrevious(){
//        var i = currentPageIndex - 1;
//        if(doc.hasPage(i)){
//            loadPage(i);
//        }else{
//
//        }
//    }
//
//    function loadPage(index){
//        if(doc.hasPage(index)){
//            var url = doc.pages[index];
//            // $.ajax(
//            //     url,
//
//            //     {
//            //         xhrFields: {
//            //             crossDomain: true,
//            //             withCredentials: true
//            //         },
//
//            //         success: function(data, status){
//            //             currentPageIndex = index;
//            //             $("#currentPage").val(doc.page(currentPageIndex));
//            //             $("#page-container").html(data);
//
//            //             var p = doc.page(currentPageIndex);
//            //             console.log("look at page ", p);
//            //             window.history.pushState(
//            //                 currentPageIndex,
//            //                 "State 2013 — " + p,
//            //                 doc.getPageURL(p)
//            //             );
//            //         },
//
//            //         error: function(xhr, aaa, error){
//            //             console.log(error);
//            //         }
//            //     }
//            // );
//            $.get(url, function(data){
//                currentPageIndex = index;
//                $("#currentPage").val(doc.page(currentPageIndex));
//                $("#page-container").html(data);
//
//                var p = doc.page(currentPageIndex);
//                console.log("look at page ", p);
//                window.history.pushState(
//                    currentPageIndex,
//                    "State 2013 — " + p,
//                    doc.getPageURL(p)
//                );
//            });
//        }
//    }
//})();