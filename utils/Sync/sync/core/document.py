import os
from tempfile import mkstemp

from sync.core import Sync
from utils.hash import hash_file, hash_str
from utils.image import create_image
from utils.image.resize import image_magick_pdf_to_img
from utils.text.transform import url_encode_text, url_encode_file


class SyncDocument(Sync):
    def __init__(self, collection, provider, sizes, dir_static_previews, url_base_preview, url_base_document):
        super().__init__()
        self.collection = collection
        self.provider = provider
        self.sizes = sizes
        self.dir_static_previews = dir_static_previews
        self.url_base_preview = url_base_preview
        self.url_base_document = url_base_document

    def create(self, document):
        file = document['file']
        filename = os.path.basename(file)

        document['type'] = self.document_type(document)
        document['preview'] = self.create_preview(file, sizes=self.sizes, preview_dir=self.dir_static_previews)
        document['file'] = {
            'name': filename,
            'size': self.provider.size(file)
        }

        return document

    def document_type(self, document):
        if document['category'] == 'Награды':
            return 'award'
        return 'document'

    def create_id(self, document):
        bn = os.path.basename(document['file'])
        document['id'] = url_encode_text('{category}-{file}'.format(
            category=document['category'],
            file=bn
        ))
        return document

    def create_url(self, document):
        filename = os.path.basename(document['file'])
        document['url'] = self.url_base_document.format(file=url_encode_file(filename))
        return document

    def create_hash(self, document):
        document['hash'] = hash_str(
            hash_str(document) + self.provider.hash(document['file'])
        )
        return document

    def create_preview(self, file, sizes, preview_dir):
        temp_preview_path = pdf_to_jpg(self.provider, file)

        file = os.path.basename(file)
        file = url_encode_text(file)
        url = lambda size, ext: self.url_base_preview.format(id=file, size=size, ext=ext)

        img = create_image(temp_preview_path, sizes, url, preview_dir)
        os.remove(temp_preview_path)
        return img


def pdf_to_jpg(provider, pdf):
    # cwd = os.getcwd()
    # abspdf = os.path.join(cwd, pdf)
    abspdf = provider.get_abs(pdf)
    _, temp = mkstemp('.jpg')
    image_magick_pdf_to_img(abspdf, temp)
    return temp


