import Data from './Data'
import ImageArtifactType from './ImageArtifactType'
import { findOne } from '../lib/store'
import { mapOf } from '../server/lib'
import { ObjectId } from 'mongodb'

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
    public hash: any
    public file: any
    public artifacts: any

    constructor({ hash, file, artifacts }) {
        this.hash = hash
        this.file = file

        this.artifacts = mapOf(ImageArtifact, artifacts)
    }

    getArtifact(size) {
        return this.artifacts.get(size)
    }

    findArtifact(sizes) {
        for (let size of sizes) {
            const a = this.getArtifact(size)
            if (a) return a
        }

        return null
    }

    getPicture(size) {
        const retinaSize = ImageArtifactType.retina(size)

        const a = this.getArtifact(size)
        const a2 = this.getArtifact(retinaSize)
        const srcset = !a2
            ? []
            : [{
                url: a2.url,
                density: ImageArtifactType.RETINA_DENSITY,
            }]

        return {
            src: a.url,
            width: a.width,
            height: a.height,
            set: srcset,
        }
    }
}

class ImageArtifact {
    public url: any
    public size: any
    public width: any
    public height: any

    constructor({ url, size, width, height }) {
        this.url = url
        this.size = size
        this.width = width
        this.height = height
    }
}
