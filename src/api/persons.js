import ImageArtifactType from '../core/ImageArtifactType'
const profilePicture = profile => profile.picture.getPicture(ImageArtifactType.BIG)

export function encodePerson(person) {
    return {
        ...person,
        shortName: person.shortName(),
        name: person.splitName(),
        picture: profilePicture(person),
    }
}