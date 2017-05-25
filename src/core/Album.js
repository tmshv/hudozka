const Data = require('./Data')
const Image = require('./Image')
const ImageArtifactType = require('./ImageArtifactType')
const {find, findOne} = require('../lib/store')

const previewTypes = [
	ImageArtifactType.MEDIUM,
	ImageArtifactType.BIG,
	ImageArtifactType.ORIGIN,
]
const store = () => Data.getStore(Album)

class Album {
	static async find(query, options = {}) {
		const items = await find(store(), query, options)

		return Promise.all(items.map(processAlbum))
	}

	static async findById(id) {
		const item = await findOne(store(), {id})

		return !item
			? null
			: processAlbum(item)
	}
}

const previewFromImage = (imgs = []) => imgs.length
	? imgs[0]
	: null

const processAlbum = async album => {
	const previewImageId = album.preview ? album.preview : previewFromImage(album.images)
	let preview
	if (previewImageId) {
		const image = await Image.findById(previewImageId)
		preview = image.findArtifact(previewTypes)
	} else {
		preview = {
			url: null,
		}
	}

	return {
		...album,
		preview,
		url: `/album/${album.id}`,
	}
}

module.exports = Album
