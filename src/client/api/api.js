import APIFeed from './APIFeed';
import APIGallery from './APIGallery';
import APIDocument from './APIDocument';

export default function (app) {
    app.factory('api', function ($http) {
        let api = {};
        api.news = new APIFeed($http);
        api.gallery = new APIGallery($http);
        api.document = new APIDocument($http);

        return api;
    });
};