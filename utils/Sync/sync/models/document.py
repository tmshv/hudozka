import os
from tempfile import mkstemp

import settings
from sync.models import Model
from utils.fn import last_good, lmap
from utils.hash import hash_str
from utils.image import create_image
from utils.image.resize import image_magick_pdf_to_img
from utils.text.transform import url_encode_text, url_encode_file


class Document(Model):
    @staticmethod
    def read(path):
        name = os.path.basename(path)

        document = {
            'file': path,
            'category': os.path.dirname(path),
            'title': os.path.splitext(name)[0]
        }

        return document

    def __init__(self, provider, path, url_base, preview_compiler):
        super().__init__()

        self.path = path

        self.category = None
        self.file = None
        self.id = None
        self.type = None
        self.url = None
        self.title = None
        self.preview = None

        for k, v in m.items():
            setattr(self, k, v)

        self.provider = provider

    def bake(self):
        file = self.file
        filename = os.path.basename(file)

        self.type = document_type(self.type)
        self.preview = self.create_preview(file)
        self.title = last_good([
            self.title,
            get_pdf_title(self.provider, self.file)
        ])
        self.file = {
            'name': filename,
            'size': self.provider.size(file)
        }

    def __set_id(self):
        bn = os.path.basename(self.file)
        self.id = url_encode_text('{category}-{file}'.format(
            category=self.category,
            file=bn
        ))

    def __set_url(self):
        filename = os.path.basename(self.file)
        self.url = self.url_base_document.format(file=url_encode_file(filename))

    def __set_hash(self):
        hash_keys = ['id', 'url']
        hash_doc = lmap(
            lambda key: getattr(self, key),
            hash_keys
        )
        self.hash = hash_str(
            hash_str(hash_doc) + self.provider.hash(self.file)
        )

    def create_preview(self, file):
        def url(size, ext):
            return self.url_base_preview.format(id=file, size=size, ext=ext)

        temp_preview_path = pdf_to_jpg(self.provider, file)
        file = os.path.basename(file)
        file = url_encode_text(file)
        img = create_image(temp_preview_path, self.sizes, url, settings.dir_static_images)
        os.remove(temp_preview_path)
        return img


def document_type(doctype):
    if doctype == 'Награды':
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
