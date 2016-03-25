import EndPoint from './EndPoint';

export default class Media extends EndPoint {
    shortname(name){
        return this.request('GET', `/media/shortcode/${name}?access_token=${this.token}`);
    }
}
