import os
from tempfile import mkstemp

import settings
from sync import untouched
from sync.core import Sync
from sync.data import Provider
from sync.models.Document import Document

from utils.fn import last_good
from utils.hash import hash_str
from utils.image import create_image
from utils.image.resize import image_magick_pdf_to_img
from utils.text.transform import url_encode_text, url_encode_file


class SyncDocument(Sync):
    def __init__(self, provider: Provider, sizes):
        super().__init__(provider, Document)
        self.sizes = sizes

    def _get_build_args(self):
        return {
            'sizes': self.sizes,
        }


def validate(self, documents):
    files = [doc['file'] for doc in documents]
    file_names = [os.path.basename(f) for f in files]
    file_names = set(file_names)

    if len(file_names) != len(documents):
        raise Exception('File names should be unique')


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


def create_id(self, document: dict) -> dict:
    filepath = document['file']
    filename = os.path.basename(filepath)

    return {
        **document,
        'id': self.id_template.format(
            category=url_encode_text(document['category']),
            file=url_encode_text(filename)
        ),
    }


def create_url(self, document: dict) -> dict:
    filename = os.path.basename(document['file'])

    return {
        **document,
        'url': self.url_template.format(
            file=url_encode_file(filename)
        ),
    }


def create_hash(self, document: dict) -> dict:
    hash_doc = [document[key] for key in self.hash_keys]

    return {
        **document,
        'hash': hash_str(
            hash_str(hash_doc) + self.provider.hash(document['file'])
        ),
    }


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
