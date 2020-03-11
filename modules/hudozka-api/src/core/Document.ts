import Data from './Data'
import Image from './Image'
import { find, findOne } from '../lib/store'

const store = () => Data.getStore('Document')

export default class Document {
    static async find(query, options = {}): Promise<Document[]> {
        const items = await find(store(), query, options as any)

        return Promise.all(items.map(processDocument))
    }

    static async findBySlug(slug: string) {
        const data = await findOne(store(), { id: slug })
        if (!data) return null

        return processDocument(data)
    }

    public id: any
    public hash: any
    public file: any
    public fileInfo: FileInfo
    public type: any
    public title: any
    public category: any
    public url: any
    public preview: Image
    public viewUrl: any

    constructor(data: { preview: Image, [name: string]: any }) {
        this.id = data.id
        this.hash = data.hash
        this.file = data.file
        // In the future: use fileInfo only
        this.fileInfo = data.fileInfo
            ? new FileInfo(data.fileInfo)
            : new FileInfo(data.file)
        this.type = data.type
        this.title = data.title
        this.category = data.category
        this.url = data.url

        this.preview = data.preview
        this.viewUrl = `/document/${this.id}`
    }
}

class FileInfo {
    public name: string
    public size: number

    constructor(data) {
        this.name = data.name
        this.size = data.size
    }
}

const processDocument = async data => {
    const imageId = data.preview
    const preview = await Image.findById(imageId)

    return new Document({
        ...data,
        preview,
    })
}
