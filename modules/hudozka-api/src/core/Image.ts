import Data from './Data'
import { findOne } from '../lib/store'
import { ObjectId } from 'mongodb'

/**
 *
 * {a: {}, b: {}, ...} -> Map (a: Class, b: Class)
 *
 * @param Class
 * @param object
 */
function mapOf(Class, object) {
    return Object
        .entries(object)
        .reduce((map, i) => (
            map.set(i[0], new Class(i[1]))
        ), new Map())
}

const store = () => Data.getStore('Image')

export default class Image {
    static async findById(id: ObjectId) {
        const data = await findOne(store(), { _id: id })
        if (!data) return null

        const artifacts = data.data
        return new Image({ ...data, artifacts })
    }

    static async findByFile(file: string) {
        const data = await findOne(store(), { file })
        if (!data) return null

        const artifacts = data.data
        return new Image({ ...data, artifacts })
    }
    public hash: string
    public file: string
    public artifacts: Map<string, ImageArtifact>

    constructor({ hash, file, artifacts }) {
        this.hash = hash
        this.file = file

        this.artifacts = mapOf(ImageArtifact, artifacts)
    }

    getArtifact(size: string) {
        return this.artifacts.get(size)
    }
}

class ImageArtifact {
    public url: string
    public size: string
    public width: number
    public height: number

    constructor({ url, size, width, height }) {
        this.url = url
        this.size = size
        this.width = width
        this.height = height
    }
}
