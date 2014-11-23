/**
 * Created by tmshv on 23/11/14.
 */

module.exports = function(app) {
    app.directive("timeline", function () {
        return {
            templateUrl: "/views/timeline.html",
            scope: {

            },
            link: function(scope, element, attrs){
                scope.isEven = function(index){
                    return index % 2 === 1;
                }
            },
            controller: function($scope, api){
                api.feed.post()
                    .success(function (list) {
                        $scope.feed = list.map(function (post) {
                            return {
                                date: post.publishDate,
                                image: post.data.images.standard_resolution.url,
                                url: post.data.link,
                                username: post.data.user.username,
                                userpic: post.data.user.profile_picture,
                                text: post.data.caption.text
                            }
                        });
                    });
            }
        };
    });
};