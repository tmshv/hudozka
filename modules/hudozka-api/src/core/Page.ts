import Data from './Data'
import { find as storeFind, findOne, total } from '../lib/store'
import Image from './Image'
import { Tag } from './Tag'

const store = () => Data.getStore('Page')

export default class Page {
    static async find(query, options = {}): Promise<Page[]> {
        const items = await storeFind(store(), query, options as any)

        return Promise.all(items.map(processPage))
    }

    static async findById(id) {
        const item = await findOne(store(), { id })

        return !item
            ? null
            : processPage(item)
    }

    static async findByUrl(url) {
        const item = await findOne(store(), { url })

        return !item
            ? null
            : processPage(item)
    }

    static async total(query = {}) {
        return total(store(), query)
    }

    public id: any
    public hash: any
    public file: any
    public url: string
    public content: any
    public title: any
    public date: Date
    public tags: Tag[]
    public data: any
    public images: any
    public documents: any
    public preview: any
    public tokens: any[]
    public description: string

    constructor(data) {
        this.id = data.id
        this.hash = data.hash
        this.file = data.file
        this.url = data.url
        this.content = data.content
        this.title = data.title
        this.data = data.data
        this.date = data.date
        this.images = data.images
        this.documents = data.documents
        this.preview = data.preview
        this.tokens = data.tokens
        this.tags = (data.tags || []).map(x => new Tag(x))
        this.description = data.description
    }
}

const previewFromImage = (imgs = []) => imgs.length
    ? imgs[0]
    : null

async function processPage(article) {
    let preview = null
    const previewId = article.preview
        ? article.preview
        : previewFromImage(article.images)

    if (previewId) {
        preview = await Image.findById(previewId)
    }

    return new Page({
        ...article,
        preview,
    })
}
