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
            controller: function($scope, api){
                api.feed.post()
                    .success(function (list) {
                        $scope.feed = list.map(function (post) {
                            var author_id = personByInstagram(team.team, post.data.user.username);
                            var name = author_id ? team.short(author_id) : post.data.user.username;
                            return {
                                date: post.publishDate,
                                image: post.data.images.standard_resolution.url,
                                url: post.data.link,
                                username: name,
                                userpic: post.data.user.profile_picture,
                                text: post.data.caption.text.replace(/#[\w_]+/, "")
                            };
                        });
                    });
            }
        };
    });
};