import Timeline from './Timeline'
import Schedule from './Schedule'
import Document from './Document'

export default class DataManager {
	constructor(stores) {
		this.timeline = new Timeline(stores.timeline)
		this.schedule = new Schedule(stores.schedules)
		this.document = new Document(stores.documents)
	}
}
