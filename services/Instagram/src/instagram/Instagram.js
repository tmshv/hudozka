import Subscription from './Subscription';
import User from './User';
import Media from './Media';

export default class Instagram {
    constructor(clientId, clientSecret, accessToken, createApi) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.accessToken = accessToken;

        const authenticatedApi = createApi(clientId, clientSecret, accessToken);
        const api = createApi(clientId, clientSecret);
        
        //noinspection JSUnresolvedVariable
        this.user = new User(authenticatedApi);
        this.subscriptions = new Subscription(api);
        this.media = new Media(api, accessToken);
    }
}
