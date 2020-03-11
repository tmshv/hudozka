import Data from './Data'
import { find as storeFind, findOne, total } from '../lib/store'
import Image from './Image'
import { Tag } from './Tag'
import { ObjectId } from 'mongodb'
import { Breadcrumb } from '../types'

const store = () => Data.getStore('Page')

type PageDto = {
    [name: string]: any
    preview?: ObjectId
    images: ObjectId[]
}

export default class Page {
    static async find(query, options = {}): Promise<Page[]> {
        const items = await storeFind(store(), query, options as any)

        return Promise.all(items.map(processPage))
    }

    static async findByUrl(url: string) {
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
    public images: ObjectId[]
    public documents: any
    public preview?: Image
    public tokens: any[]
    public description: string
    public featured: boolean

    private breadcrumb: Breadcrumb

    constructor(data: { [name: string]: any }) {
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
        this.tags = (data.tags || []).map((x: string) => new Tag(x, x))
        this.featured = data.featured
        this.description = data.description
    }

    public setBreadcrumb(value: Breadcrumb) {
        this.breadcrumb = value
        return this
    }

    public getBreadcrumb() {
        return this.breadcrumb
    }

    public getUrl() {
        return this.url
    }
}

function firstItem<T>(items: T[] = []): T {
    return items.length
        ? items[0]
        : null
}

async function processPage(item: PageDto): Promise<Page> {
    let preview: Image = null
    const previewId = item.preview
        ? item.preview
        : firstItem(item.images)

    if (previewId) {
        preview = await Image.findById(previewId)
    }

    return new Page({
        ...item,
        preview,
    })
}
