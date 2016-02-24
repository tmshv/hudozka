import API from '../api/API';

export default function (app) {
    app.factory('api', $http =>     new API($http));
};