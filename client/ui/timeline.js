/**
 * Created by tmshv on 23/11/14.
 */

function personByInstagram(list, instagram){
    list = list.filter(function (member) {
        try {
            return member.contacts.instagram === instagram;
        } catch (error) {
            return false;
        }
    });

    if(list.length){
        return list[0].id;
    }else{
        return null;
    }
}

function postText(post){
    try{
        return post.data.caption.text.replace(/#[\w_]+/, "")
    }catch(error){
        return "";
    }
}

module.exports = function(app) {
    app.directive("timeline", function (team) {
        return {
            templateUrl: "/views/timeline.html",
            scope: {

            },
            link: function(scope, element, attrs){
                scope.isEven = function(index){
                    return index % 2 === 1;
                }
            },
            controller: function($scope, $timeout, usSpinnerService, api){
                var portion = 0;
                var count = 10;
                $scope.feed = [];

                $scope.timelineUpdating = false;
                usSpinnerService.stop("timelineMore");
                //usSpinnerService.spin("timelineMore");

                $scope.recordClass = function (i) {
                    return i['type'];
                };

                $scope.loadNext = function () {
                    $scope.timelineUpdating = true;
                    usSpinnerService.spin("timelineMore");

                    api.news.feed(count, portion)
                        .error(function(error) {
                            console.log(error);
                        })
                        .success(function (list) {
                            $scope.timelineUpdating = false;
                            usSpinnerService.stop("timelineMore");
                            //$timeout(function () {
                            //
                            //}, 5000);

                            var feed = list.map(function (post) {
                                if(post.type == "instagram"){
                                    var author_id = personByInstagram(team.team, post.data.author);
                                    var name = author_id ? team.short(author_id) : post.data.author;

                                    return {
                                        date: post.date,
                                        image: post.data.image.standard_resolution.url,
                                        url: post.data.url,
                                        username: name,
                                        //userpic: post.data.user.profile_picture,
                                        text: post.body,
                                        //text: postText(post),
                                        type: post.type
                                    };
                                }else{
                                    return post;
                                }
                            });

                            portion++;
                            $scope.feed = $scope.feed.concat(feed);
                        });
                };

                $scope.loadNext();
            }
        };
    });

    app.directive("timelineRecord", function ($compile, $http, $sce, team) {
        var templates = {
            "post": ["/views/timeline-post.html", linkPost],
            "instagram": ["/views/timeline-gram.html", linkGram]
        };

        function linkPost(scope, element, attrs) {
            scope.message = $sce.trustAsHtml(scope.post.body);
        }

        function linkGram(scope, element, attrs) {
        }

        return {
            restrict: "E",
            scope: {
                post:"=content"
            },
            link: function(scope, element, attrs){
                var type = scope.post.type;
                if(type in templates) {
                    $http.get(templates[type][0])
                        .success(function (tpl) {
                            element.html(tpl).show();
                            $compile(element.contents())(scope);
                            templates[type][1](scope, element, attrs);
                        });
                }

            }
        };
    });
};