import Data from './Data'
import { findOne } from '../lib/store'

export default class Config {
    static get store() {
        return Data.getStore('Settings')
    }

    static async findConfig() {
        const config = await Config.findById('settings')
        return config || new Config({} as any)
    }

    static async findById(id) {
        const data = await findOne(Config.store, { id })
        if (!data) return null

        return new Config(data)
    }

    public hash: any
    public file: any
    public server: any
    public articlesPerPage: any
    public collectiveOrder: any
    public articleCardDefaultPreview: any
    public collectiveImage: any
    public redirect: any

    constructor({ hash, file, ...data }) {
        this.hash = hash
        this.file = file
        this.server = data.server
        this.articlesPerPage = data.articlesPerPage || 5
        this.collectiveOrder = data.collectiveOrder || []
        this.articleCardDefaultPreview = data.articleCardDefaultPreview
        this.collectiveImage = data.collectiveImage

        const redirect = data.redirect || {}
        this.redirect = new Map(Object
            .entries(redirect)
        )
    }
}
