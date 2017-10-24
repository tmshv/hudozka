class ImageArtifactType {
	constructor() {
		throw new Error('Cannot create instance of ImageArtifactType')
	}
}

ImageArtifactType.SMALL = 'small'
ImageArtifactType.MEDIUM = 'medium'
ImageArtifactType.BIG = 'big'
ImageArtifactType.LARGE = 'large'
ImageArtifactType.ORIGIN = 'original'
ImageArtifactType.ORIGINAL = 'original'

ImageArtifactType.FACEBOOK = 'fb'

ImageArtifactType.RETINA_DENSITY = 2
ImageArtifactType.retina = type => `${type}@${ImageArtifactType.RETINA_DENSITY}`

module.exports = ImageArtifactType
