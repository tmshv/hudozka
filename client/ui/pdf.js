/**
 * Created by tmshv on 24/11/14.
 */

module.exports = function (app) {
    app.directive("pdf", function () {
        return {
            scope: {
                document: "="
            },
            templateUrl: "/views/pdf.html",
            link: function (scope, element, attrs) {

            },

            controller: function ($scope) {
                var doc = $scope.document;
                if (doc.extra && doc.extra.style) {
                    angular.element("head").append('<link href="' + doc.extra.style + '" rel="stylesheet">');
                }

                $scope.$watch(
                    function () {
                        return $scope.document.currentPage;
                    },
                    function (value) {
                        value = parseInt(value);
                        try{
                            $scope.pageURL = $scope.document.url[value];
                        }catch (error){
                            $scope.pageURL = "";
                        }
                    }
                );

                //const PAGES = [];
                //var currentPageIndex = 0;
                //var doc = new Document(location.pathname.replace(/\/\d+$/, ""));

                //$(document).ready(function(){
                //    try{
                //        var hrefPage = /\/(\d+)$/.exec(location.href)[1];
                //        currentPageIndex = parseInt(hrefPage) - 1;
                //    }catch(error){
                //
                //    }

                //$("#buttonNext").click(function(event){
                //    loadNext();
                //});
                //
                //$("#buttonPrev").click(function(event){
                //    loadPrevious();
                //});
                //
                //$("#page-container .pf").each(function(index, elem){
                //    var url = $(elem).data("page-url");
                //    doc.pages.push(url);
                //});
                //
                //$("#currentPage").attr("max", doc.pages.length);
                //$("#totalPages").text(doc.pages.length);
                //$("#currentPage").change(function(){
                //    var i = parseInt($(this).val()) - 1;
                //    if(i && doc.hasPage(i)){
                //        loadPage(i);
                //    }
                //});
                //
                //$("#page-container").html("");
                //loadPage(currentPageIndex);
                //
                //window.addEventListener("popstate", function(event){
                //    console.log("pops");
                //    console.log(event);
                //    var i = event.state;
                //    loadPage(i);
                //});
                //});

                //function loadNext(){
                //    var i = currentPageIndex + 1;
                //    if(doc.hasPage(i)){
                //        loadPage(i);
                //    }else{
                //
                //    }
                //}
                //
                //function loadPrevious(){
                //    var i = currentPageIndex - 1;
                //    if(doc.hasPage(i)){
                //        loadPage(i);
                //    }else{
                //
                //    }
                //}
                //
                //function loadPage(index){
                //    if(doc.hasPage(index)){
                //        var url = doc.pages[index];
                //        // $.ajax(
                //        //     url,
                //
                //        //     {
                //        //         xhrFields: {
                //        //             crossDomain: true,
                //        //             withCredentials: true
                //        //         },
                //
                //        //         success: function(data, status){
                //        //             currentPageIndex = index;
                //        //             $("#currentPage").val(doc.page(currentPageIndex));
                //        //             $("#page-container").html(data);
                //
                //        //             var p = doc.page(currentPageIndex);
                //        //             console.log("look at page ", p);
                //        //             window.history.pushState(
                //        //                 currentPageIndex,
                //        //                 "State 2013 — " + p,
                //        //                 doc.getPageURL(p)
                //        //             );
                //        //         },
                //
                //        //         error: function(xhr, aaa, error){
                //        //             console.log(error);
                //        //         }
                //        //     }
                //        // );
                //        $.get(url, function(data){
                //            currentPageIndex = index;
                //            $("#currentPage").val(doc.page(currentPageIndex));
                //            $("#page-container").html(data);
                //
                //            var p = doc.page(currentPageIndex);
                //            console.log("look at page ", p);
                //            window.history.pushState(
                //                currentPageIndex,
                //                "State 2013 — " + p,
                //                doc.getPageURL(p)
                //            );
                //        });
                //    }
                //}
            }
        };
    });
};