import APIFeed from './APIFeed';
import APIGallery from './APIGallery';
import APIDocument from './APIDocument';
import APICollective from './APICollective';
import APISchedule from './APISchedule';
import APIEvent from './APIEvent';

export default class API {
    constructor(request) {
        this.news = new APIFeed(request);
        this.gallery = new APIGallery(request);
        this.document = new APIDocument(request);
        this.collective = new APICollective(request);
        this.schedule = new APISchedule(request);
        this.event = new APIEvent(request);
    }
}