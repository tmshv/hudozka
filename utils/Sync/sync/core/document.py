import os
from tempfile import mkstemp

from sync.core import Sync
from utils.fn import last_good, lmap
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

        document['type'] = document_type(document)
        document['preview'] = self.create_preview(file, sizes=self.sizes, preview_dir=self.dir_static_previews)
        document['title'] = last_good([
            document['title'],
            get_pdf_title(self.provider, document['file'])
        ])
        document['file'] = {
            'name': filename,
            'size': self.provider.size(file)
        }

        return document

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
        hash_keys = ['id', 'url']
        hash_doc = lmap(
            lambda key: document[key],
            hash_keys
        )
        document['hash'] = hash_str(
            hash_str(hash_doc) + self.provider.hash(document['file'])
        )
        return document

    def create_preview(self, file, sizes, preview_dir):
        def url(size, ext):
            return self.url_base_preview.format(id=file, size=size, ext=ext)

        temp_preview_path = pdf_to_jpg(self.provider, file)
        file = os.path.basename(file)
        file = url_encode_text(file)
        img = create_image(temp_preview_path, sizes, url, preview_dir)
        os.remove(temp_preview_path)
        return img


def document_type(document):
    if document['category'] == 'Награды':
        return 'award'
    return 'document'


def pdf_to_jpg(provider, pdf):
    _, temp_in = mkstemp(suffix='.pdf')
    _, temp_out = mkstemp(suffix='.jpg')

    abspdf = provider.copy(pdf, temp_in)
    image_magick_pdf_to_img(abspdf, temp_out)

    os.remove(temp_in)
    return temp_out


def get_pdf_title(provider, file):
    from PyPDF2 import PdfFileReader
    from PyPDF2.generic import TextStringObject
    from PyPDF2.generic import IndirectObject

    pdf = PdfFileReader(provider.read(file))
    info = pdf.getDocumentInfo()

    if info:
        if type(info.title) == TextStringObject:
            return str(info.title)

        if type(info.title_raw) == IndirectObject:
            o = pdf.getObject(info.title_raw)
            return str(o)
    return None
