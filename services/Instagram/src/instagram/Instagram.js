import Subscription from './Subscription';
import User from './User';

export default class Instagram {
    constructor(clientId, clientSecret, accessToken, createApi) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;

        const authenticatedApi = createApi(clientId, clientSecret, accessToken);
        const api = createApi(clientId, clientSecret);
        
        //noinspection JSUnresolvedVariable
        this.user = new User(authenticatedApi);
        this.subscriptions = new Subscription(api);
    }
}
