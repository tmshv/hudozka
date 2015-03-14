/**
 * Created by tmshv on 06/11/14.
 */

angular.module("hudozhka.instagram", [])
    .controller("InstagramController", function($scope, $http, $window){
        //$scope.auth = function() {
        //    $http.get("/instagram/auth/url")
        //        .success(function (data) {
        //            $window.location.href = data.url;
        //        });
        //};

        $http.get("/instagram/user")
            .error(function() {

            })
            .success(function (user) {
                $scope.user = user;
            });

        $scope.invite = function() {
            $http.get("/instagram/invite")
                .success(function (data) {
                    $scope.inviteCode = data.code;
                });
        };
    });