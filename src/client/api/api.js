import APIFeed from './APIFeed';
import APIGallery from './APIGallery';
import APIDocument from './APIDocument';
import APICollective from './APICollective';

export default function (app) {
    app.factory('api', function ($http) {
        let api = {};
        api.news = new APIFeed($http);
        api.gallery = new APIGallery($http);
        api.document = new APIDocument($http);
        api.collective = new APICollective($http);

        return api;
    });
};