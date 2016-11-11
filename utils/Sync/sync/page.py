import os

import settings
from sync.core import Sync
from sync.data import list_images
from sync import create_date_and_title_from_folder_name, create_post_from_image_list, create_date, images_from_html, \
    synced_images_ids, untouched, title_from_html
from sync.core.post import SyncPost
from utils.fn import lmap, map_cases, first, key_mapper, lmapfn, constant
from utils.hash import hash_str
from utils.io import read_yaml_md
from utils.text.transform import url_encode_text


def create_document_from_folder(provider, path):
    document = {
        'file': os.path.basename(path),
        'folder': os.path.dirname(path),
        'title': os.path.basename(path),
    }

    manifest = get_manifest(provider, path)
    document = {
        **document,
        **manifest,
    }

    if 'url' not in document:
        return None

    document = create_id(document)
    document = create_hash(provider, document)
    return document


def get_manifest(provider, path):
    data = provider.read(path).read().decode('utf-8')
    y, m = read_yaml_md(data)
    y = y if y else {}

    if 'date' in y:
        y['date'] = create_date(y['date'], settings.date_formats)

    if 'until' in y:
        y['until'] = create_date(y['until'], settings.date_formats)

    if 'id' in y:
        y['id'] = str(y['id'])

    return {
        **y,
        'data': m,
        'title': title_from_html(m),
        'images': images_from_html(m)
    }


def create_id(document):
    new_id = url_encode_text(document['url'])
    return {
        **document,
        'id': document['id'] if 'id' in document else new_id
    }


def create_hash(provider, document):
    files = sorted([document['file']] + document['images'])
    hashes = lmap(
        provider.hash,
        lmap(
            lambda x: os.path.join(document['folder'], x),
            files
        )
    )

    return {
        **document,
        'hash':hash_str(''.join(hashes))
    }


def sync_pages(provider, collection, update=True, delete=True, skip_unchanged=True):
    sync = Sync()
    sync.collection = collection

    documents = list(filter(
        lambda x: provider.is_dir(x),
        provider.scan('.')
    ))

    documents = lmap(
        lambda x: provider.type_filter(x, '.md'),
        documents
    )

    documents = list(filter(
        lambda x: len(x),
        documents
    ))

    documents = lmap(
        lambda x: create_document_from_folder(provider, x[0]),
        documents
    )

    documents = list(filter(None, documents))

    # CREATE SCOPE OF CURRENT SESSION
    documents_ids = lmapfn(documents)(
        lambda i: i['id']
    )

    # SKIP UNTOUCHED DOCUMENTS
    if skip_unchanged:
        documents = untouched(documents, sync)

    # # MAP EVENT MANIFEST -> EVENT_OBJECT
    # documents = lmap(
    #     sync.create,
    #     documents
    # )

    # REPLACE IMAGES OBJECTS WITH IT _ID IN MONGODB
    documents = lmap(
        key_mapper('images', synced_images_ids),
        documents
    )

    # SYNC EVENT_OBJECT WITH DB
    if update:
        documents = lmap(
            sync.update,
            documents
        )

    documents_to_delete = []
    if delete:
        remove_query = sync.create_remove_query({'id': {'$nin': documents_ids}})
        documents_to_delete = sync.query(remove_query)
        documents_to_delete = lmap(
            sync.delete,
            map(
                lambda i: {'_id': i['_id']},
                documents_to_delete
            )
        )

    return documents, documents_to_delete
