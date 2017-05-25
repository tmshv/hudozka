class ImageArtifact {
	constructor() {
		throw new Error('Cannot create instance of ImageArtifact')
	}
}

ImageArtifact.MEDIUM = 'medium'
ImageArtifact.BIG = 'big'
ImageArtifact.ORIGIN = 'origin'

module.exports = ImageArtifact
