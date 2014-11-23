/**
 * Created by tmshv on 22/11/14.
 */

module.exports = function (app) {
    app.controller("HomePageController", function ($scope) {
        $scope.pageClass = "page-home";
    });

    app.controller("FeedController", function ($scope, api) {
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
    });
};