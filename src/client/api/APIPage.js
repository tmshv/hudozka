import EndPoint from './EndPoint';

export default class APIPage extends EndPoint {
	url(url) {
		return this.get(url);
	}
}
