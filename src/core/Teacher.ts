import Data from './Data'
import Image from './Image'
import { find, findOne } from '../lib/store'

const store = () => Data.getStore('Teacher')

export default class Teacher {
    static async find(query, options = {}) {
        const items = await find(store(), query, options as any)

        return Promise.all(items.map(processProfile))
    }

    static async findById(id) {
        const data = await findOne(store(), { id })
        if (!data) return null

        return processProfile(data)
    }

    public id: any
    public post: any
    public file: any
    public edu: any
    public picture: any
    public preview: any
    public diploma: any
    public position: any
    public name: any
    public status: any
    public hash: any
    public url: any

    constructor(data) {
        this.id = data.id
        this.post = data.post
        this.file = data.file
        this.edu = data.edu
        this.picture = data.picture
        this.preview = data.preview
        this.diploma = data.diploma
        this.position = data.position
        this.name = data.name
        this.status = data.status
        this.hash = data.hash

        this.url = `/teacher/${this.id}`
    }

	/**
	 *
	 * "First Middle Last" -> "F. M. Last"
	 *
	 * @returns {string}
	 */
    shortName() {
        const f = i => i.replace(/^(.).+/, '$1')
        const [first, middle, last] = this.splitName()

        return `${f(first)}. ${f(middle)}. ${last}`
    }

	/**
	 *
	 * "First Middle Last" -> ["First", "Middle", "Last"]
	 *
	 * @returns {Array|{index: number, input: string}}
	 */
    splitName() {
        const name = this.name
        const m = /(.+)\s(.+)\s(.+)/.exec(name)
        return m.slice(1)
    }
}

const processProfile = async profile => {
    const imageId = profile.picture
    const previewId = profile.preview
    const picture = await Image.findById(imageId)
    const preview = await Image.findById(previewId)

    return new Teacher({
        ...profile,
        picture,
        preview,
    })
}
