angular.module('hudozka.instagram', [])
    .controller('InstagramController', function ($scope, $http) {
        //$scope.auth = function() {
        //    $http.get("/instagram/auth/url")
        //        .success(function (data) {
        //            $window.location.href = data.url;
        //        });
        //};

        $http.get('/instagram/user')
            .then(i => i.data)
            .then(user => {
                $scope.user = user;
            });

        $scope.invite = function() {
            $http.get('/instagram/invite')
                .then(i => i.data)
                .success(data => {
                    $scope.inviteCode = data.code;
                });
        };
    });