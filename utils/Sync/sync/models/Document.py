import os
from tempfile import mkstemp

import settings
from db import collection
from sync.data import scan_subdirs, request
from sync.models import Model
from sync.models.Image import Image
from utils.fn import last_good
from utils.hash import hash_str
from utils.image.resize import image_magick_pdf_to_img
from utils.text.transform import url_encode_text, url_encode_file

store = collection(settings.collection_documents)


class Document(Model):
    @staticmethod
    async def find(query):
        return store.find(query)

    @staticmethod
    async def delete(query):
        return store.find_one_and_delete(query)

    @staticmethod
    async def scan(provider):
        paths = scan_subdirs(provider, '.pdf')
        return [Document.read_path(provider, path) for path in paths]

    @staticmethod
    def read_path(provider, path):
        name = os.path.basename(path)

        document = {
            'category': os.path.dirname(path),
            'title': os.path.splitext(name)[0]
        }

        return Document(
            provider,
            path,
            **document
        )

    def __init__(self, provider, file, category=None, title=None):
        self.__hash_keys = ['id', 'url']

        self.__id_template: str = '{category}-{file}'
        self.__url_template: str = settings.document_url_template
        self.__url_preview_template: str = settings.document_url_preview_template

        self.category = category
        self.title = title
        self.type = None
        self.preview = None

        super().__init__(provider, store, file)

    def init(self):
        self.__set_id()
        self.__set_url()
        self.__set_hash()

    async def build(self, **kwargs):
        sizes = kwargs['sizes']
        await self.create_preview(sizes)

    async def save(self):
        document = self.bake()

        query = {'id': document['id']}
        try:
            self.store.update_one(query, {'$set': document}, upsert=True)
            # return self.read(document)
            return self
        except ValueError:
            pass
        return None

    async def upload(self):
        filepath = self.provider.get_local(self.file)
        name = os.path.basename(self.url)
        url = settings.document_url_upload_template.format(file=name)

        await request.upload(url, filepath)

    def bake(self):
        file = self.file
        filename = os.path.basename(file)

        return {
            'id': self.id,
            'hash': self.hash,
            'url': self.url,
            'type': document_type(self.type),
            'file': {
                'name': filename,
                'size': self.provider.size(file)
            },
            'preview': self.preview,
            'title': last_good([
                self.title,
                get_pdf_title(self.provider, self.file)
            ]),
        }

    def __filename(self):
        return os.path.basename(self.file)

    def __set_id(self):
        self.id = self.__id_template.format(
            category=url_encode_text(self.category),
            file=url_encode_text(self.__filename())
        )

    def __set_url(self):
        self.url = self.__url_template.format(
            file=url_encode_file(self.__filename())
        )

    def __set_hash(self):
        doc = [getattr(self, key) for key in self.__hash_keys]

        self.hash = hash_str(
            hash_str(doc) + self.provider.hash(self.file)
        )

    async def create_preview(self, sizes):
        def url(_, size, ext):
            file = url_encode_text(self.__filename())
            return self.__url_preview_template.format(id=file, size=size, ext=ext)

        temp_preview_path = pdf_to_jpg(self.provider, self.file)
        preview = await Image.new(self.provider, temp_preview_path, sizes, url)

        if preview:
            self.preview = preview.id

        os.remove(temp_preview_path)

    def __str__(self):
        return '<Document hash={} file={} id={}>'.format(self.hash, self.file, self.id)


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
