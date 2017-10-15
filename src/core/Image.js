const Data = require('./Data')
const ImageArtifactType = require('./ImageArtifactType')
const {findOne} = require('../lib/store')
const {mapOf} = require('../lib/common')

const store = () => Data.getStore(Image)

class Image {
	static async findById(id) {
		const data = await findOne(store(), {_id: id})
		if (!data) return null

		const artifacts = data.data
		return new Image({...data, artifacts})
	}

	static async findByFile(file) {
		const data = await findOne(store(), {file})
		if (!data) return null

		const artifacts = data.data
		return new Image({...data, artifacts})
	}

	constructor({hash, file, artifacts}) {
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
		return {
			src: a.url,
			width: a.width,
			height: a.height,
			set: [
				{
					url: a2.url,
					density: ImageArtifactType.RETINA_DENSITY,
				}
			]
		}
	}
}

class ImageArtifact {
	constructor({url, size, width, height}) {
		this.url = url
		this.size = size
		this.width = width
		this.height = height
	}
}

module.exports = Image
