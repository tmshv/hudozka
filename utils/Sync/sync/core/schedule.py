import os
from tempfile import mkstemp

from sync.core import Sync
from utils.fn import last_good, lmap
from utils.hash import hash_str, hash_file
from utils.image import create_image
from utils.image.resize import image_magick_pdf_to_img
from utils.text.transform import url_encode_text, url_encode_file


class SyncSchedule(Sync):
    def __init__(self, collection, provider):
        super().__init__()
        self.collection = collection
        self.provider = provider

    def create_id(self, document):
        period = get_period(document['period'])
        doc_id = document['id'] if 'id' in document and document['id'] else None
        if not doc_id:
            doc_id = 'schedule-{period}-{semester}'.format(period=period, semester=document['semester'])
        document['id'] = doc_id
        return document

    def create_hash(self, document):
        return {
            **document,
            'hash': self.provider.hash(document['file'])
        }


def get_period(value):
    if isinstance(value, str):
        return value

    if isinstance(value, list):
        return '-'.join(lmap(str, value))
