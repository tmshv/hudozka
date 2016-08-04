from db import db
from settings import image_name_format, image_base_url
from utils.fn import lmap


# class SyncImage(Sync):
#     def __init__(self, sizes, save_path, create_url_fn):
#         super().__init__()
#         self.sizes = sizes
#         self.save_path = save_path
#         self.create_url_fn = create_url_fn
#         self.collection = db().images
#
#     def create_id(self, document):
#         id = document['id'] if 'id' in document and document['id'] else None
#         if not id:
#             id = 'schedule-{period}-{semester}'.format(**document)
#         document['id'] = id
#         return document
#
#     def read(self, document):
#         return super().read(document)
#
#     def create_hash(self, document):
#         return {
#             **document,
#             'hash': hash_file(document)
#         }
#
#     def create(self, document):
#         image = create_image(document, self.sizes, self.create_url_fn, self.save_path)
#
#         return {
#             'file': document,
#             'hash': self.create_hash(document),
#             'data': image['data']
#         }
#
#     def find_or_create(self, document):
#         i = self.read(document)
#         if not i:
#             return self.create(document)
#         return i


def sync_image(record):
    if isinstance(record, list):
        return lmap(
            sync_image,
            record
        )

    q = {'hash': record['hash']}
    try:
        db().images.update_one(q, {'$set': record}, upsert=True)
        i = db().images.find_one({'hash': record['hash']})
        return i
    except ValueError:
        pass

    return None


def image_create_url(file):
    url = image_base_url + image_name_format
    return url.format(file)
