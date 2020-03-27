import os
from tempfile import mkstemp

import settings
from db import collection
from sync.data import request
from sync.models import Model
from sync.models.DocumentPreviewImage import DocumentPreviewImage
from utils.hash import hash_str, md5
from utils.image import image_magick_pdf_to_img

store = collection(settings.collection_documents)


class Document(Model):
    @staticmethod
    async def find_one(query):
        return store.find_one(query)

    @staticmethod
    async def find(query):
        return store.find(query)

    @staticmethod
    async def delete(query):
        return store.find_one_and_delete(query)

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
            document
        )

    @staticmethod
    async def new(provider, file, sizes):
        document = Document.read_path(provider, file)
        changed = await document.is_changed()
        if changed:
            document.hide()
            await document.build(sizes=sizes)
            await document.upload()
            await document.save()
        else:
            doc = await Document.find_one({'file': file})
            document = Document(provider, file, doc)
            document.ref = doc['_id']
            await document.create_preview(sizes)

        return document

    def __init__(self, provider, file, params=None):
        self.__hash_salt = settings.hash_salt_documents
        self.__hash_keys = ['id', 'url']

        self.__id_template: str = '{category}-{file}'
        self.__url_template: str = 'https://static.shlisselburg.org/art/uploads/{file}'
        self.__url_preview_template: str = settings.document_url_preview_template

        self.title = None
        self.file_name = None
        self.file_size = None
        self.preview = None

        self.type = 'document'  # 'award'
        self.hidden = False

        super().__init__(provider, store, file, params=params)

    def init(self):
        self.__set_id()
        self.__set_url()
        self.__set_hash()
        self._set_origin()

        filename = os.path.basename(self.file)
        self.file_name = filename
        self.file_size = self.provider.size(self.file)

        if self.has_param('title'):
            self.title = self.get_param('title')

        if self.has_param('hidden'):
            self.hidden = self.get_param('hidden')
    
    def set_title(self, value: str):
        self.title = value

    async def build(self, **kwargs):
        sizes = kwargs['sizes']
        await self.create_preview(sizes)

        pdf_title = await get_pdf_title(self.provider, self.file)
        if pdf_title:
            self.title = pdf_title

    async def save(self):
        document = self.bake()

        query = {'id': document['id']}
        try:
            self.store.update_one(query, {'$set': document}, upsert=True)

            doc = await Document.find_one(query)
            self.ref = doc['_id']

            return self
        except ValueError:
            pass
        return None

    async def upload(self):
        filepath = self.provider.get_local(self.file)
        name = os.path.basename(self.url)

        await request.s3_put(f'uploads/{name}', filepath)

    def bake(self):
        return {
            **self.params,
            'id': self.id,
            'file': self.file,
            'hash': self.hash,
            'url': self.url,
            'type': self.type,
            'title': self.title,
            'origin': self.origin,
            'hidden': self.hidden,
            'preview': self.preview.ref,
            'fileInfo': {
                'name': self.file_name,
                'size': self.file_size,
            },
        }

    def __filename(self):
        return os.path.basename(self.file)

    def __set_id(self):
        self.id = md5(self.file)

    def __set_url(self):
        s = os.path.splitext(self.file)
        file = f'{self.id}{s[1]}'

        self.url = self.__url_template.format(
            file=file
        )

    def __set_hash(self):
        doc = [getattr(self, key) for key in self.__hash_keys]

        self.hash = hash_str(
            self.__hash_salt + hash_str(doc) + self.provider.hash(self.file)
        )

    async def create_preview(self, sizes):
        self.preview = await DocumentPreviewImage.new(self.provider, self.file, sizes)

    def hide(self):
        self.hidden = True
        return self

    def __str__(self):
        return f'<Document file={self.file} id={self.id}>'


async def get_pdf_title(provider, file):
    from PyPDF2 import PdfFileReader
    from PyPDF2.generic import TextStringObject
    from PyPDF2.generic import IndirectObject

    def t(value):
        value = str(value)
        value = value.replace('\u0000', '')
        if value == 'None':
            return None
        if value == '':
            return None
        return value

    pdf = PdfFileReader(provider.read(file))
    info = pdf.getDocumentInfo()

    if info:
        if type(info.title) == TextStringObject:
            return t(info.title)

        if type(info.title_raw) == IndirectObject:
            o = pdf.getObject(info.title_raw)
            return t(info.title)
    return None
