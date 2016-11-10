import settings
from sync.core import Sync
from utils.hash import hash_str
from utils.image import create_image
from utils.text.transform import url_encode_text

url_base = settings.teacher_image_url_base
sizes = settings.teacher_image_sizes


class SyncPerson(Sync):
    def __init__(self, collection, provider, dir_local_images):
        super().__init__()
        self.collection = collection
        self.provider = provider
        self.dir_local_images = dir_local_images

    def compile(self, profile):
        image_path = self.provider.get_abs(profile['picture'])
        profile['picture'] = create_image(
            image_path,
            sizes,
            lambda size, ext: url_base.format(id=profile['id'], size=size, ext=ext),
            self.dir_local_images
        )
        return profile

    def create_id(self, document):
        if 'id' in document and document['id']:
            return document

        document['id'] = url_encode_text(document['name'])
        return document

    def create_hash(self, document):
        document['hash'] = hash_str(
            self.provider.hash(document['file']) + self.provider.hash(document['picture'])
        )
        return document
