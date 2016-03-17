import APITimeline from './APITimeline';
import APIAlbum from './APIAlbum';
import APIDocument from './APIDocument';
import APITeacher from './APITeacher';
import APISchedule from './APISchedule';
import APIEvent from './APIEvent';
import APIArticle from './APIArticle';

export default class API {
    constructor(request) {
        this.timeline = new APITimeline(request);
        this.album = new APIAlbum(request);
        this.document = new APIDocument(request);
        this.teacher = new APITeacher(request);
        this.schedule = new APISchedule(request);
        this.event = new APIEvent(request);
        this.article = new APIArticle(request);
    }
}
