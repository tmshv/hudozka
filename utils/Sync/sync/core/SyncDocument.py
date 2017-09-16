import os
from tempfile import mkstemp

import logging

import settings
from sync import untouched
from sync.core import Sync
from sync.data import scan_subdirs, Provider
from sync.models.Document import Document

from sync.models import Model
from utils.fn import last_good, lmap
from utils.hash import hash_str
from utils.image import create_image
from utils.image.resize import image_magick_pdf_to_img
from utils.text.transform import url_encode_text, url_encode_file

logger = logging.getLogger(settings.name + '.Document')


class SyncDocument(Sync):
    def __init__(self, provider: Provider, collection, sizes):
        super().__init__(provider, collection)
        self.sizes = sizes
        self.dir_static_previews = ''

        self.temp_dir = '/Users/tmshv/HudozkaSyncTemp'

    async def clean(self):
        pass

    async def run(self):
        logger.info('Checking documents for update')

        documents = await Document.scan(self.provider)
        documents_id = [doc.id for doc in documents]
        # self.validate(documents)
        logger.info('Found {} Document(s)'.format(len(documents)))

        # SKIP UNTOUCHED DOCUMENTS
        # documents = untouched(documents, self)
        documents = await untouched(documents)
        logger.info('Changed {} Document(s)'.format(len(documents)))

        # UPDATING
        if settings.update_enabled:
            if len(documents) == 0:
                logger.info('No Documents to update')

            for document in documents:
                logger.info('Updating Document {}'.format(document.id))

                await document.upload()
                await document.create_preview(self.sizes)
                await document.save()

                logger.info('Updated Document {}'.format(document.id))

        # DELETING
        if settings.delete_enabled:
            documents_delete = list(self.query({'id': {'$nin': documents_id}}))

            if len(documents_delete) == 0:
                logger.info('No Documents to delete')

            for document in documents_delete:
                logger.info('Deleting {}'.format(document['id']))

                q = {'_id': document['_id']}
                self.delete(q)

        await self.clean()


async def get_assets(self, document) -> []:
    return []


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
