import os
from glob import glob
from shutil import copyfile
from tempfile import mkstemp

import settings
from db import db
from sync import Sync, synced_image_id, untouched
from utils.fn import combine, lmap, lprint_json, lprint, key_mapper, lmapfn
from utils.hash import hash_file, hash_str
from utils.image import create_image
from utils.image.resize import image_magick_pdf_to_img
from utils.io import read_yaml
from utils.text.transform import url_encode_text, url_encode_file


class SyncDocument(Sync):
    def __init__(self, collection_name, sizes, dir_static_previews, url_base_preview, url_base_document):
        super().__init__()
        self.collection = db()[collection_name]
        self.sizes = sizes
        self.dir_static_previews = dir_static_previews
        self.url_base_preview = url_base_preview
        self.url_base_document = url_base_document

    def create(self, document):
        file = document['file']
        filename = os.path.basename(document['file'])

        document['type'] = self.document_type(document)
        document['preview'] = self.create_preview(file, sizes=self.sizes, preview_dir=self.dir_static_previews)
        document['file'] = {
            'name': filename,
            'size': os.path.getsize((file))
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
            hash_str(document) + hash_file(document['file'])
        )
        return document

    def create_preview(self, file, sizes, preview_dir):
        temp_preview_path = pdf_to_jpg(file)

        file = os.path.basename(file)
        file = url_encode_text(file)
        url = lambda size, ext: self.url_base_preview.format(id=file, size=size, ext=ext)

        img = create_image(temp_preview_path, sizes, url, preview_dir)
        os.remove(temp_preview_path)
        return img


def pdf_to_jpg(pdf):
    cwd = os.getcwd()
    abspdf = os.path.join(cwd, pdf)
    _, temp = mkstemp('.jpg')
    image_magick_pdf_to_img(abspdf, temp)
    return temp


def categorize_files_list(files, title):
    """
    Adds specified category to each file in files list
    :param files:
    :param title:
    :return:
    """
    return map(
        lambda profile: {
            **profile,
            'category': title
        },
        files
    )


def unwrap_manifest(param):
    if isinstance(param, list):
        return combine(map(
            unwrap_manifest,
            param
        ))

    if 'files' in param:
        return lmap(
            unwrap_manifest,
            categorize_files_list(param['files'], param['title'])
        )

    if 'file' not in param:
        return None

    return param


def documents_from_yaml(dirpath):
    # GET DOCUMENT YAML_MANIFEST FILES
    documents = glob(dirpath + '/*.yaml')

    # READ YAML_MANIFEST FILES
    documents = lmap(
        read_yaml,
        documents
    )

    # GET FLAT LIST OF DOCUMENTS
    documents = unwrap_manifest(documents)

    return documents


def documents_from_subdirs():
    documents = lmap(
        lambda i: i.path,
        filter(
            lambda i: i.is_dir(),
            os.scandir('.')
        )
    )

    documents = lmap(
        lambda folder: lmap(
            lambda path: {
                'file': path,
                'title': os.path.splitext(os.path.basename(os.path.relpath(path, folder)))[0],
                'category': os.path.basename(folder)
            },
            glob(folder + '/*.pdf')
        ),
        documents
    )

    documents = combine(documents)
    return documents


def get_pdf_title(file):
    from PyPDF2 import PdfFileReader
    from PyPDF2.generic import TextStringObject
    from PyPDF2.generic import IndirectObject

    pdf = PdfFileReader(open(file, 'rb'))
    info = pdf.getDocumentInfo()

    if info:
        if type(info.title) == TextStringObject:
            return str(info.title)

        if type(info.title_raw) == IndirectObject:
            o = pdf.getObject(info.title_raw)
            return str(o)
    return None


def until_none(ls):
    better = None
    for i in ls:
        if (i is not None) and i != '':
            better = i
    return better


def main(dir_documents, dir_static_uploads, sync, update_documents=True, delete_documents=True):
    """

    :param dir_documents:
    :param dir_static_uploads:
    :param sync:
    :param update_documents:
    :param delete_documents:
    :return:
    """

    os.chdir(dir_documents)

    # documents = documents_from_yaml()
    documents = documents_from_subdirs()

    # CHOICE BETTER TITLE
    documents = lmapfn(documents)(
        lambda i: {
            **i,
            'title': until_none([i['title'], get_pdf_title(i['file'])])
        }
    )

    # CREATE DOCUMENT IDENTITY
    documents = lmap(sync.create_id, documents)

    # CREATE HASH OF DOCUMENT FILE
    documents = lmap(sync.create_hash, documents)

    # CREATE SCOPE
    scope_documents_ids = lmap(
        lambda i: i['id'],
        documents
    )

    file_names = set(lmap(
        lambda i: i['file'],
        documents
    ))
    if len(file_names) != len(documents):
        raise Exception('File names should be unique')

    # SKIP UNTOUCHED DOCUMENTS
    documents = untouched(documents, sync)

    # URL
    documents = lmap(sync.create_url, documents)

    # COPY FILE -> STATIC_DIR/URL_FILENAME
    out_path = lambda doc: os.path.join(dir_static_uploads, os.path.basename(doc['url']))
    lmap(
        lambda doc: copyfile(
            doc['file'],
            out_path(doc)
        ),
        documents
    )

    # MAP DOCUMENT PROFILE FROM MANIFEST TO DOCUMENT_OBJECT
    documents = lmap(
        sync.create,
        documents
    )

    if update_documents:
        # REPLACE PREVIEW_OBJECT WITH IT _ID IN MONGODB
        documents = lmap(
            key_mapper('preview', lambda i: synced_image_id(i)),
            documents
        )

        # SYNC DOCUMENT_OBJECT WITH DB
        documents = lmap(
            sync.update,
            documents
        )

    if delete_documents:
        documents_to_delete = sync.query({'id': {'$nin': scope_documents_ids}})
        documents_to_delete = lmap(
            sync.delete,
            map(
                lambda i: {'_id': i['_id']},
                documents_to_delete
            )
        )
    else:
        documents_to_delete = []

    print('SCOPE:', len(scope_documents_ids))
    lprint(scope_documents_ids)

    print('DELETE DOCUMENTS: %s' % ('NO' if not delete_documents else str(len(documents_to_delete))))
    lprint_json(documents_to_delete)

    print('UPDATE DOCUMENTS:', len(documents))
    lprint_json(documents)

    print('[SYNC DOCUMENTS DONE]')


if __name__ == '__main__':
    main(
        settings.dir_documents,
        settings.dir_static_uploads,
        SyncDocument(
            'documents',
            sizes=settings.image_sizes,
            dir_static_previews=settings.dir_static_images,
            url_base_preview=settings.url_base_preview,
            url_base_document=settings.url_base_document,
        ),
        update_documents=True,
        delete_documents=True
    )

    # DOCUMENT_OBJECT SAMPLE
    # {
    #     "hash": "c6a2aaf9a393c683c2250dd916115b7056ef16f023e0cd348c184a85cde9c9a0",
    #     "_id": {
    #         "$oid": "56d08411ace9573958e5e497"
    #     },
    #     "type": "document",
    #     "id": "dlya-postupayuschih-dogovor-o-pozhertvovanii-pdf",
    #     "category": "Для поступающих",
    #     "file": {
    #         "size": 53088,
    #         "name": "Договор о пожертвовании.pdf"
    #     },
    #     "url": "https://static.shburg.org/art/uploads/dogovor-o-pozhertvovanii.pdf",
    #     "preview": {
    #         "$oid": "56d08007ace9573958e5e48f"
    #     },
    #     "title": "Договор о пожертвовании"
    # }
