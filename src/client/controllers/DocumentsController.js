export default function (app) {
    app.controller('DocumentsController', ($scope, api, docs) => {
        $scope.documents = docs.docs;

        api.document.awards()
            .success(data => {
                $scope.awards = data;
            });
    });
};
