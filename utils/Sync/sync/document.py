import os
from glob import glob

import settings
from db import db
from sync import synced_image_id, untouched
from sync.core.document import SyncDocument
from sync.data import scan_subdirs
from sync.models.document import Document
from utils.fn import combine, lmap, key_mapper, lmapfn
from utils.io import read_yaml


def sync_documents(provider, collection, update=True, delete=True):
    """
    DOCUMENT_OBJECT SAMPLE
    {
        "hash": "c6a2aaf9a393c683c2250dd916115b7056ef16f023e0cd348c184a85cde9c9a0",
        "_id": {
            "$oid": "56d08411ace9573958e5e497"
        },
        "type": "document",
        "id": "dlya-postupayuschih-dogovor-o-pozhertvovanii-pdf",
        "category": "Для поступающих",
        "file": {
            "size": 53088,
            "name": "Договор о пожертвовании.pdf"
        },
        "url": "https://static.shburg.org/art/uploads/dogovor-o-pozhertvovanii.pdf",
        "preview": {
            "$oid": "56d08007ace9573958e5e48f"
        },
        "title": "Договор о пожертвовании"
    }

    :param provider:
    :param update:
    :param delete:
    :return:
    """

    static_path = static_path_fn(settings.dir_static_uploads)

    return main(
        SyncDocument(
            collection,
            provider,
            sizes=settings.image_sizes,
            dir_static_previews=settings.dir_static_images,
            url_base_preview=settings.url_base_preview,
            url_base_document=settings.url_base_document,
        ),
        static_path,
        update_documents=update,
        delete_documents=delete
    )


def main(sync, static_path, update_documents, delete_documents):
    documents = scan_subdirs(sync.provider, '.pdf')
    documents = lmap(
        lambda document: read_document(sync, document),
        documents
    )
    documents_id = lmap(
        lambda document: document['id'],
        documents
    )

    # CHECKING
    file_names = set(lmap(
        lambda document: document['file'],
        documents
    ))
    if len(file_names) != len(documents):
        raise Exception('File names should be unique')

    # SKIP UNTOUCHED DOCUMENTS
    documents = untouched(documents, sync)

    # COPY FILE -> STATIC_DIR/URL_FILENAME
    for i in documents:
        sync.provider.copy(
            i['file'],
            static_path(i)
        )

    # MAP DOCUMENT PROFILE FROM MANIFEST TO DOCUMENT_OBJECT
    documents = lmap(
        sync.create,
        documents
    )

    if update_documents:
        # REPLACE PREVIEW_OBJECT WITH IT _ID IN MONGODB
        documents = lmap(
            key_mapper('preview', lambda img: synced_image_id(img)),
            documents
        )

        # SYNC DOCUMENT_OBJECT WITH DB
        documents = lmap(
            sync.update,
            documents
        )

    # DELETING
    documents_delete = sync.query({'id': {'$nin': documents_id}})
    if delete_documents:
        documents_delete = lmap(
            sync.delete,
            map(
                lambda document: {'_id': document['_id']},
                documents_delete
            )
        )

    return documents, documents_delete


def read_document(sync, path):
    name = os.path.basename(path)

    document = {
        'file': path,
        'category': os.path.dirname(path),
        'title': os.path.splitext(name)[0]
    }

    document = sync.create_id(document)
    document = sync.create_url(document)
    document = sync.create_hash(document)

    return document


def create_document(provider, m):
    # dir_static_previews = settings.dir_static_images,
    # url_base_preview = settings.url_base_preview,
    # url_base_document = settings.url_base_document
    return Document(provider, m, {})


def static_path_fn(dir_path):
    return lambda document: os.path.join(dir_path, os.path.basename(document['url']))


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
